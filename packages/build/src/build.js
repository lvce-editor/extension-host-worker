import { execa } from 'execa'
import { build } from 'esbuild'
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { bundleJs } from './bundleJs.js'
import { root } from './root.js'

const dist = join(root, '.tmp', 'dist')
const external = ['node:buffer', 'node:worker_threads', 'electron', 'ws']

const readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(path)))
    } else {
      files.push(path)
    }
  }
  return files
}

const writeJson = async (path, json) => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const getGitTagFromGit = async () => {
  const { stdout, stderr, exitCode } = await execa('git', ['describe', '--exact-match', '--tags'], {
    reject: false,
  })
  if (exitCode) {
    if (exitCode === 128 && stderr.startsWith('fatal: no tag exactly matches')) {
      return '0.0.0-dev'
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const getVersion = async () => {
  const { env } = process
  const { RG_VERSION, GIT_TAG } = env
  if (RG_VERSION) {
    if (RG_VERSION.startsWith('v')) {
      return RG_VERSION.slice(1)
    }
    return RG_VERSION
  }
  if (GIT_TAG) {
    if (GIT_TAG.startsWith('v')) {
      return GIT_TAG.slice(1)
    }
    return GIT_TAG
  }
  return getGitTagFromGit()
}

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

const version = await getVersion()

await bundleJs({
  inFile: 'packages/extension-host-worker/src/extensionHostWorkerMain.ts',
  outFile: '.tmp/dist/dist/extensionHostWorkerMain.js',
})

await build({
  bundle: false,
  entryPoints: await walk(join(root, 'packages', 'extension-api', 'src')),
  format: 'esm',
  outbase: join(root, 'packages', 'extension-api', 'src'),
  outdir: join(root, '.tmp', 'dist', 'dist', 'extension-api'),
  platform: 'browser',
})

await build({
  bundle: true,
  entryPoints: [join(root, 'packages', 'extension-api', 'src', 'index.ts')],
  external,
  format: 'esm',
  outfile: join(root, '.tmp', 'dist', 'dist', 'extension-api', 'index.js'),
  platform: 'browser',
})

const extensionApiFiles = await walk(join(root, '.tmp', 'dist', 'dist', 'extension-api'))
for (const file of extensionApiFiles) {
  if (file.endsWith('.js')) {
    const content = await readFile(file, 'utf8')
    await writeFile(file, content.replace(/\.ts(['"])/g, '.js$1'))
  }
}

const packageJson = await readJson(join(root, 'packages', 'extension-host-worker', 'package.json'))

delete packageJson.scripts
delete packageJson.devDependencies
delete packageJson.prettier
delete packageJson.jest
delete packageJson.xo
delete packageJson.directories
delete packageJson.nodemonConfig
packageJson.version = version
packageJson.main = 'dist/extensionHostWorkerMain.js'

await writeJson(join(dist, 'package.json'), packageJson)

await cp(join(root, 'README.md'), join(dist, 'README.md'))
await cp(join(root, 'LICENSE'), join(dist, 'LICENSE'))
