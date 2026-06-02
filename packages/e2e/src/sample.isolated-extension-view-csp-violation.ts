import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-csp-violation'

export const skip = true

export const test: Test = async ({ expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="CSP Violation"]')
  await expect(item).toBeVisible()
  await item.click()

  await expect(Locator('iframe.ExtensionViewIframe[title="CSP Violation"]')).toBeVisible()
  await expect(Locator('text=script blocked')).toBeVisible()
}
