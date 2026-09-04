import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-status-bar-items-error'

// Requires the released extension API in the e2e editor build.
export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.statusBarItemsError')

  const errorMessage = Locator('text=status bar render failed')
  await expect(errorMessage).toBeVisible()
}
