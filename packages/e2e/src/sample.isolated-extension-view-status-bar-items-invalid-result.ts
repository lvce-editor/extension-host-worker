import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-status-bar-items-invalid-result'

// Requires the released extension API in the e2e editor build.
export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.statusBarItemsInvalidResult')

  const errorMessage = Locator('text=view renderStatusBarItems result must be an array')
  await expect(errorMessage).toBeVisible()
}
