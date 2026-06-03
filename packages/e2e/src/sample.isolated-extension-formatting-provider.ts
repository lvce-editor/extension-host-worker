import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-formatting-provider'

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Workspace }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, 'const value=1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText('const value = 1')
}
