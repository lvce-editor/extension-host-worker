import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.status-bar-item-provider-click'

export const skip = 1

export const test: Test = async ({ Extension, FileSystem, Locator, expect }) => {
  // arrange
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  // @ts-ignore
  const tmpDir = await FileSystem.getTmpDir()

  // assert
  const item = Locator('.StatusBarItem[name="xyz"]')
  await expect(item).toBeVisible()
  // TODO wait for status bar item to be visible
}
