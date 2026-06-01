import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const extensionHostWorkerPath = join(root, '.tmp', 'dist', 'dist', 'extensionHostWorkerMain.js')
const typescriptCompileProcessPath = join(nodeModulesPath, '@lvce-editor', 'typescript-compile-process', 'dist', 'index.js')

const staticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')
const indexHtmlPath = join(staticPath, 'index.html')

const indexHtmlContent = await readFile(indexHtmlPath, 'utf8')

const remoteUrl = getRemoteUrl(extensionHostWorkerPath)

const config = {
  'develop.extensionHostWorkerPath': remoteUrl,
  extensionHostWorkerUrl: remoteUrl,
}
const stringifiedConfig = JSON.stringify(config, null, 2)
const newContent = indexHtmlContent.replace(
  '</title>',
  `</title>
  <script type="application/json" id="Config">${stringifiedConfig}</script>`,
)

await writeFile(indexHtmlPath, newContent)

const patchTypeScriptCompileProcess = async () => {
  const content = await readFile(typescriptCompileProcessPath, 'utf8')
  if (content.includes('rewriteLvceEditorApiImports')) {
    return
  }
  const extensionApiUrl = getRemoteUrl(join(root, 'packages', 'extension-api', 'src', 'index.ts'))
  const helper = `
const rewriteLvceEditorApiImports = code => {
  return code.replace(/(['"])@lvce-editor\\/api\\1/g, \`'${
    extensionApiUrl
  }'\`);
};
`
  let patched = content.replace('const transpileTypeScript2 = async code => {', `${helper}\nconst transpileTypeScript2 = async code => {`)
  patched = patched.replace('const transformed = stripTypeScriptTypes(code);\n    return transformed;', 'const transformed = stripTypeScriptTypes(code);\n    return rewriteLvceEditorApiImports(transformed);')
  patched = patched.replace('return newContent;', 'return {\n      ...newContent,\n      outputText: rewriteLvceEditorApiImports(newContent.outputText)\n    };')
  await writeFile(typescriptCompileProcessPath, patched)
}

await patchTypeScriptCompileProcess()
