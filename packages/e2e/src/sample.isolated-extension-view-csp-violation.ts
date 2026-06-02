import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-csp-violation'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="CSP Violation"]')
  await expect(item).toBeVisible()
  await ActivityBar.toggleActivityBarItem('sample.views.cspViolation')

  const iframe = Locator('iframe.ExtensionViewIframe[title="CSP Violation"]')
  const scriptBlocked = Locator('text=script blocked')
  await expect(iframe).toBeVisible()
  await expect(scriptBlocked).toBeVisible()
}
