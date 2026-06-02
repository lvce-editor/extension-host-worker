import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-iframe-load-error'

export const skip = true

export const test: Test = async ({ expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="Load Error"]')
  await expect(item).toBeVisible()
  await item.dispatchEvent('click')

  const iframe = Locator('iframe.ExtensionViewIframe[title="Load Error"]')
  const errorMessage = Locator('text=Failed to load extension view iframe')
  await expect(iframe).toBeVisible()
  await expect(errorMessage).toBeVisible()
}
