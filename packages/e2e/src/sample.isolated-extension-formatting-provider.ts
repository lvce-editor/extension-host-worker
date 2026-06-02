import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-formatting-provider'

export const skip = true

export const test: Test = async ({ Command, Editor, Extension, FileSystem, Main, Workspace }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, 'const value=1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.js`)

  await Command.execute('Editor.format')

  await Editor.shouldHaveText('const value = 1')
}
