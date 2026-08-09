import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-status-bar-items'

// Requires the released extension API in the e2e editor build.
export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator, Main }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.statusBarItems')

  const dimensions = Locator('.StatusBarItem[name="view-dimensions"]')
  const size = Locator('.StatusBarItem[name="view-size"]')
  await expect(dimensions).toBeVisible()
  await expect(dimensions).toHaveText('640x480')
  await expect(size).toBeVisible()
  await expect(size).toHaveText('42 KB')

  await Main.closeAllEditors()
  await expect(dimensions).toBeHidden()
  await expect(size).toBeHidden()
}
