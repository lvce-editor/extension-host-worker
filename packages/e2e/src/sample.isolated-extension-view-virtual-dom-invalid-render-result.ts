import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-virtual-dom-invalid-render-result'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.virtualDomInvalidRenderResult')

  const errorMessage = Locator('text=view render result must be an array')
  await expect(errorMessage).toBeVisible()
}
