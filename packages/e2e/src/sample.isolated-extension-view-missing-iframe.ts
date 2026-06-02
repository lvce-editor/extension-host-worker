import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-missing-iframe'

export const skip = true

export const test: Test = async ({ expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="Missing Iframe"]')
  await expect(item).toBeVisible()
  await item.click()

  await expect(Locator('text=view sample.views.missingIframe is missing iframe contribution')).toBeVisible()
}
