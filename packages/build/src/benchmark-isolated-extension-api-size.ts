import { build } from 'esbuild'
import type { Plugin, PluginBuild } from 'esbuild'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { deflateRawSync } from 'node:zlib'
import { root } from './root.ts'

const benchmarkDir = join(root, '.tmp', 'benchmark')
const sourceDir = join(benchmarkDir, 'src')
const bundleDir = join(benchmarkDir, 'bundles')
const zipDir = join(benchmarkDir, 'zips')
const apiEntry = join(root, 'packages', 'extension-api', 'src', 'index.ts')
const external = ['electron', 'node:buffer', 'node:worker_threads']

interface BenchmarkCase {
  readonly id: string
  readonly label: string
  readonly source: string
}

interface BenchmarkResult {
  readonly id: string
  readonly label: string
  readonly rawBytes: number
  readonly zipBytes: number
}

const cases: readonly BenchmarkCase[] = [
  {
    id: 'baseline',
    label: 'Activate only',
    source: `import { activate as activateExtensionApi } from '@lvce-editor/api'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
}
`,
  },
  {
    id: 'completion',
    label: 'Completion provider',
    source: `import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCompletionProvider({
    id: 'benchmarkCompletion',
    languageId: 'benchmark',
    provideCompletions() {
      return [
        {
          label: 'benchmarkResult',
          type: 1,
        },
      ]
    },
  })
}
`,
  },
  {
    id: 'hover',
    label: 'Hover provider',
    source: `import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerHoverProvider({
    id: 'benchmarkHover',
    languageId: 'benchmark',
    provideHover() {
      return {
        text: 'benchmark hover result',
      }
    },
  })
}
`,
  },
  {
    id: 'output-channel',
    label: 'Output channel',
    source: `import { activate as activateExtensionApi, createOutputChannel } from '@lvce-editor/api'

const output = createOutputChannel('benchmark-output')

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  await output.appendLine('benchmark extension activated')
}
`,
  },
]

const sizeFormatter = new Intl.NumberFormat('en-US')

const apiAliasPlugin: Plugin = {
  name: 'extension-api-source-alias',
  setup(build: PluginBuild) {
    build.onResolve({ filter: /^@lvce-editor\/api$/ }, () => {
      return {
        path: apiEntry,
      }
    })
  },
}

const crcTable = new Uint32Array(256)
for (let i = 0; i < crcTable.length; i++) {
  let value = i
  for (let j = 0; j < 8; j++) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  crcTable[i] = value >>> 0
}

const getCrc32 = (buffer: Buffer): number => {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

const writeUInt16 = (buffer: Buffer, value: number, offset: number): void => {
  buffer.writeUInt16LE(value, offset)
}

const writeUInt32 = (buffer: Buffer, value: number, offset: number): void => {
  buffer.writeUInt32LE(value >>> 0, offset)
}

const getZipFile = (fileName: string, content: Buffer): Buffer => {
  const name = Buffer.from(fileName)
  const compressed = deflateRawSync(content, { level: 9 })
  const crc32 = getCrc32(content)
  const localHeader = Buffer.alloc(30 + name.length)
  writeUInt32(localHeader, 0x04034b50, 0)
  writeUInt16(localHeader, 20, 4)
  writeUInt16(localHeader, 0, 6)
  writeUInt16(localHeader, 8, 8)
  writeUInt16(localHeader, 0, 10)
  writeUInt16(localHeader, 0, 12)
  writeUInt32(localHeader, crc32, 14)
  writeUInt32(localHeader, compressed.length, 18)
  writeUInt32(localHeader, content.length, 22)
  writeUInt16(localHeader, name.length, 26)
  writeUInt16(localHeader, 0, 28)
  name.copy(localHeader, 30)

  const centralDirectory = Buffer.alloc(46 + name.length)
  writeUInt32(centralDirectory, 0x02014b50, 0)
  writeUInt16(centralDirectory, 20, 4)
  writeUInt16(centralDirectory, 20, 6)
  writeUInt16(centralDirectory, 0, 8)
  writeUInt16(centralDirectory, 8, 10)
  writeUInt16(centralDirectory, 0, 12)
  writeUInt16(centralDirectory, 0, 14)
  writeUInt32(centralDirectory, crc32, 16)
  writeUInt32(centralDirectory, compressed.length, 20)
  writeUInt32(centralDirectory, content.length, 24)
  writeUInt16(centralDirectory, name.length, 28)
  writeUInt16(centralDirectory, 0, 30)
  writeUInt16(centralDirectory, 0, 32)
  writeUInt16(centralDirectory, 0, 34)
  writeUInt16(centralDirectory, 0, 36)
  writeUInt32(centralDirectory, 0, 38)
  writeUInt32(centralDirectory, 0, 42)
  name.copy(centralDirectory, 46)

  const end = Buffer.alloc(22)
  writeUInt32(end, 0x06054b50, 0)
  writeUInt16(end, 0, 4)
  writeUInt16(end, 0, 6)
  writeUInt16(end, 1, 8)
  writeUInt16(end, 1, 10)
  writeUInt32(end, centralDirectory.length, 12)
  writeUInt32(end, localHeader.length + compressed.length, 16)
  writeUInt16(end, 0, 20)

  return Buffer.concat([localHeader, compressed, centralDirectory, end])
}

const formatBytes = (bytes: number): string => {
  return `${sizeFormatter.format(bytes)} B`
}

const getSvg = (results: readonly BenchmarkResult[]): string => {
  const rowHeight = 52
  const labelWidth = 170
  const chartWidth = 520
  const rawColor = '#2563eb'
  const zipColor = '#16a34a'
  const maxSize = Math.max(...results.map((result) => result.rawBytes))
  const height = 72 + results.length * rowHeight
  const rows = results
    .map((result, index) => {
      const y = 56 + index * rowHeight
      const rawWidth = Math.round((result.rawBytes / maxSize) * chartWidth)
      const zipWidth = Math.round((result.zipBytes / maxSize) * chartWidth)
      return `<text x="24" y="${y + 18}" class="label">${result.label}</text>
<rect x="${labelWidth}" y="${y}" width="${rawWidth}" height="18" rx="2" fill="${rawColor}" />
<rect x="${labelWidth}" y="${y + 22}" width="${zipWidth}" height="18" rx="2" fill="${zipColor}" />
<text x="${labelWidth + rawWidth + 8}" y="${y + 14}" class="value">${formatBytes(result.rawBytes)}</text>
<text x="${labelWidth + zipWidth + 8}" y="${y + 36}" class="value">${formatBytes(result.zipBytes)} zipped</text>`
    })
    .join('\n')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="${height}" viewBox="0 0 860 ${height}" role="img" aria-labelledby="title desc">
<title id="title">Isolated extension API bundle size benchmark</title>
<desc id="desc">Raw and zipped bundle sizes for generated isolated extension worker examples.</desc>
<style>
  text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  .title { font-size: 20px; font-weight: 700; fill: #111827; }
  .legend, .value { font-size: 12px; fill: #374151; }
  .label { font-size: 14px; fill: #111827; }
</style>
<rect width="860" height="${height}" fill="#ffffff" />
<text x="24" y="30" class="title">Isolated Extension API Bundle Size</text>
<rect x="510" y="19" width="12" height="12" fill="${rawColor}" />
<text x="530" y="30" class="legend">bundle</text>
<rect x="600" y="19" width="12" height="12" fill="${zipColor}" />
<text x="620" y="30" class="legend">zip</text>
${rows}
</svg>
`
}

const getSummary = (results: readonly BenchmarkResult[]): string => {
  const rows = results.map((result) => {
    return `| ${result.label} | ${formatBytes(result.rawBytes)} | ${formatBytes(result.zipBytes)} | ${formatBytes(result.rawBytes - results[0].rawBytes)} |`
  })
  return `# Isolated Extension API Size Benchmark

Generated by \`npm run benchmark:isolated-extension-api\`.

| API usage | Bundle size | Zip size | Raw delta vs activate only |
| --- | ---: | ---: | ---: |
${rows.join('\n')}
`
}

await rm(benchmarkDir, { recursive: true, force: true })
await mkdir(sourceDir, { recursive: true })
await mkdir(bundleDir, { recursive: true })
await mkdir(zipDir, { recursive: true })

const results: BenchmarkResult[] = []

for (const benchmarkCase of cases) {
  const inFile = join(sourceDir, `${benchmarkCase.id}.ts`)
  const outFile = join(bundleDir, `${benchmarkCase.id}.js`)
  await writeFile(inFile, benchmarkCase.source)
  await build({
    bundle: true,
    entryPoints: [inFile],
    external,
    format: 'esm',
    minify: true,
    outfile: outFile,
    platform: 'browser',
    plugins: [apiAliasPlugin],
    target: 'es2022',
    treeShaking: true,
  })
  const rawBytes = (await stat(outFile)).size
  const bundleContent = await readFile(outFile)
  const zipFile = getZipFile(basename(outFile), bundleContent)
  const zipOutFile = join(zipDir, `${benchmarkCase.id}.zip`)
  await writeFile(zipOutFile, zipFile)
  const zipBytes = zipFile.length
  results.push({
    id: benchmarkCase.id,
    label: benchmarkCase.label,
    rawBytes,
    zipBytes,
  })
}

await writeFile(join(benchmarkDir, 'results.json'), JSON.stringify(results, null, 2) + '\n')
await writeFile(join(benchmarkDir, 'summary.md'), getSummary(results))
await writeFile(join(benchmarkDir, 'chart.svg'), getSvg(results))

console.log('Isolated extension API bundle size benchmark')
console.log('')
console.log('API usage'.padEnd(24) + 'Bundle'.padStart(12) + 'Zip'.padStart(12) + 'Delta'.padStart(12))
for (const result of results) {
  console.log(
    result.label.padEnd(24) +
      formatBytes(result.rawBytes).padStart(12) +
      formatBytes(result.zipBytes).padStart(12) +
      formatBytes(result.rawBytes - results[0].rawBytes).padStart(12),
  )
}
console.log('')
console.log(`Wrote ${join('.tmp', 'benchmark', 'summary.md')}`)
console.log(`Wrote ${join('.tmp', 'benchmark', 'chart.svg')}`)
