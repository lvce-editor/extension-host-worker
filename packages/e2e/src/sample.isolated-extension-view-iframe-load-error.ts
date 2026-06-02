import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-iframe-load-error'

export const skip = true

export const test: Test = async ({ Extension, Locator, expect }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="Load Error"]')
  await expect(item).toBeVisible()
  await item.click()

  const iframe = Locator('iframe.ExtensionViewIframe[title="Load Error"]')
  await expect(iframe).toBeVisible()
  await expect(Locator('text=Failed to load extension view iframe')).toBeVisible()
}
