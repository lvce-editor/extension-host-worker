import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-preferred-preview'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="Preferred Preview"]')
  await expect(item).toBeVisible()

  await ActivityBar.toggleActivityBarItem('sample.views.preferredPreview')

  const previewHeading = Locator('.Preview h1')
  await expect(item).toHaveAttribute('aria-selected', 'true')
  await expect(previewHeading).toBeVisible()
  await expect(previewHeading).toHaveText('Preview content')
}
