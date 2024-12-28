import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const aboutWorkerPath = join(root, '.tmp', 'dist', 'dist', 'aboutWorkerMain.js')

const serverStaticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

const content = await readFile(rendererWorkerMainPath, 'utf-8')
// TODO
// @ts-ignore
const remoteUrl = getRemoteUrl(aboutWorkerPath)
if (!content.includes('// const aboutWorkerUrl = ')) {
  // const occurrence = `const aboutWorkerUrl = \`\${assetDir}/packages/about-view-worker/dist/aboutWorkerMain.js\``
  // const replacement = `// const aboutWorkerUrl = \`\${assetDir}/packages/about-view-worker/dist/aboutWorkerMain.js\`
  // const aboutWorkerUrl = \`${remoteUrl}\``
  // const newContent = content.replace(occurrence, replacement)
  // await writeFile(rendererWorkerMainPath, newContent)
}
