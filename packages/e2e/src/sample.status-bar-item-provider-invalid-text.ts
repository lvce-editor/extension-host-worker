import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.status-bar-item-provider-error-invalid-text'

export const skip = 1

export const test: Test = async ({ Extension, FileSystem, Locator, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const item = Locator('.StatusBarItem[name="xyz"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveText('error')
}
