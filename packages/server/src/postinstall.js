import { readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice('file://'.length)
  return `/remote${url}`
}

const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

const extensionHostWorkerPath = join(root, '.tmp', 'dist', 'dist', 'extensionHostWorkerMain.js')
const typescriptCompileProcessPath = join(nodeModulesPath, '@lvce-editor', 'typescript-compile-process', 'dist', 'index.js')
const typescriptCompileCachePath = join(nodeModulesPath, '@lvce-editor', 'packages', 'build', '.tmp', 'typescript-compile-cache')

const staticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')
const indexHtmlPath = join(staticPath, 'index.html')

const remoteUrl = getRemoteUrl(extensionHostWorkerPath)

const config = {
  'develop.extensionHostWorkerPath': remoteUrl,
  extensionHostWorkerUrl: remoteUrl,
}
const stringifiedConfig = JSON.stringify(config, null, 2)

const patchIndexHtml = async () => {
  const indexHtmlContent = await readFile(indexHtmlPath, 'utf8')
  const contentWithoutConfig = indexHtmlContent.replace(/\n\s*<script type="application\/json" id="Config">[\s\S]*?<\/script>/, '')
  const newContent = contentWithoutConfig.replace(
    '</title>',
    `</title>
  <script type="application/json" id="Config">${stringifiedConfig}</script>`,
  )
  await writeFile(indexHtmlPath, newContent)
}

const getPatchHelper = (extensionApiUrl) => {
  return `
const lvceEditorApiUrl = '${extensionApiUrl}';
const rewriteLvceEditorApiImports = code => {
  return code.replace(/(['"])@lvce-editor\\/api\\1/g, (match, quote) => \`\${quote}\${lvceEditorApiUrl}\${quote}\`);
};
`
}

const removeInjectedPatchHelperOnce = (content) => {
  const start = content.indexOf("\nconst lvceEditorApiUrl = '")
  if (start === -1) {
    return content
  }
  const functionStart = content.indexOf('\nconst rewriteLvceEditorApiImports = code => {', start)
  if (functionStart === -1) {
    return content
  }
  const end = content.indexOf('\n};', functionStart)
  if (end === -1) {
    return content
  }
  return `${content.slice(0, start)}${content.slice(end + '\n};'.length)}`
}

const removeInjectedPatchHelpers = (content) => {
  let current = content
  while (true) {
    const next = removeInjectedPatchHelperOnce(current)
    if (next === current) {
      return current
    }
    current = next
  }
}

const hasPatchHelper = (content) => {
  return content.includes('const rewriteLvceEditorApiImports =')
}

const patchTypeScriptCompileProcess = async () => {
  const content = await readFile(typescriptCompileProcessPath, 'utf8')
  const extensionApiUrl = getRemoteUrl(join(root, '.tmp', 'dist', 'dist', 'extension-api', 'index.js'))
  const helper = getPatchHelper(extensionApiUrl)
  const contentWithoutInjectedHelpers = removeInjectedPatchHelpers(content)
  let patched = contentWithoutInjectedHelpers
  if (!hasPatchHelper(patched)) {
    patched = patched.replace('const transpileTypeScript2 = async code => {', `${helper}\nconst transpileTypeScript2 = async code => {`)
  }
  patched = patched.replace(
    /const transformed = stripTypeScriptTypes\(code\);\n\s*return .*?;/,
    'const transformed = stripTypeScriptTypes(code);\n    return rewriteLvceEditorApiImports(transformed);',
  )
  patched = patched.replace(
    /return \{\n\s*\.\.\.newContent,\n\s*outputText: rewriteLvceEditorApiImports\(newContent\.outputText\)\n\s*\};|return newContent;/,
    'return {\n      ...newContent,\n      outputText: rewriteLvceEditorApiImports(newContent.outputText)\n    };',
  )
  patched = patched.replace('await writeFile(outPath, newContent);', 'await writeFile(outPath, newContent.outputText);')
  await writeFile(typescriptCompileProcessPath, patched)
}

const clearTypeScriptCompileCache = async () => {
  await rm(typescriptCompileCachePath, { recursive: true, force: true })
}

await patchIndexHtml()
await patchTypeScriptCompileProcess()
await clearTypeScriptCompileCache()
