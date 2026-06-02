import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-completion-provider'

export const skip = true

export const test: Test = async ({ Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, 'sample')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)

  await Editor.openCompletion()

  const completions = Locator('.EditorCompletion')
  await expect(completions).toBeVisible()
  const items = Locator('.EditorCompletionItem')
  await expect(items).toHaveCount(1)
  await expect(items).toHaveText('isolatedResult')
}
