import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view'

export const skip = 1

export const test: Test = async ({ expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="Testing"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveAttribute('aria-selected', 'false')

  await item.click()

  await expect(item).toHaveAttribute('aria-selected', 'true')
  await expect(Locator('iframe.ExtensionViewIframe[title="Testing"]')).toBeVisible()
}
