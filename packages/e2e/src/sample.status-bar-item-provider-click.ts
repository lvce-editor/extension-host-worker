import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.status-bar-item-provider-click'

export const skip = 1

export const test: Test = async ({ FileSystem, Extension, Locator, expect, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  const item = Locator('.StatusBarItem[name="xyz"]')
  await expect(item).toBeVisible()

  await QuickPick.open()
  await QuickPick.handleInput('>xyz')

  // act
  await QuickPick.selectIndex(0)

  // assert
  await expect(item).toHaveText('1')
}
