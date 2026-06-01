import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-api'

export const test: Test = async ({ Extension, Locator, expect }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const item = Locator('.StatusBarItem[name="isolated-extension-api"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveText('isolated api')
}
