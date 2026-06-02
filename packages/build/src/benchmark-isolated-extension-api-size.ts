import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { rollup } from 'rollup'
import type { OutputOptions, Plugin, RollupOptions } from 'rollup'
import { ZipFile } from 'yazl'
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
  resolveId(id) {
    if (id === '@lvce-editor/api') {
      return apiEntry
    }
    return null
  },
}

const bundleBenchmark = async (inFile: string, outFile: string): Promise<void> => {
  const outputOptions: OutputOptions = {
    compact: true,
    file: outFile,
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  }
  const options: RollupOptions = {
    external,
    input: inFile,
    output: outputOptions,
    plugins: [
      apiAliasPlugin,
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [pluginTypeScript],
      }),
      nodeResolve(),
    ],
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
    },
  }
  const bundle = await rollup(options)
  await bundle.write(outputOptions)
  await bundle.close()
}

const getZipFile = async (fileName: string, content: Buffer): Promise<Buffer> => {
  const zipFile = new ZipFile()
  const chunks: Buffer[] = []
  const zipFilePromise = new Promise<Buffer>((resolve, reject) => {
    zipFile.outputStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    zipFile.outputStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    zipFile.outputStream.on('error', reject)
  })
  zipFile.addBuffer(content, fileName, {
    compress: true,
    compressionLevel: 9,
  })
  zipFile.end()
  return zipFilePromise
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
  await bundleBenchmark(inFile, outFile)
  const rawBytes = (await stat(outFile)).size
  const bundleContent = await readFile(outFile)
  const zipFile = await getZipFile(basename(outFile), bundleContent)
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
