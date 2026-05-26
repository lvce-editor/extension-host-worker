import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.status-bar-item-provider'

export const skip = 1

export const test: Test = async ({ Extension, Locator, expect }) => {
  // arrange
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  // assert
  const item = Locator('.StatusBarItem[name="xyz"]')
  await expect(item).toBeVisible()
}
