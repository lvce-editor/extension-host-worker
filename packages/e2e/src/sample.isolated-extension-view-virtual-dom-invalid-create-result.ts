import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-virtual-dom-invalid-create-result'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.virtualDomInvalidCreateResult')

  const errorMessage = Locator('text=view sample.views.virtualDomInvalidCreateResult did not return a view instance')
  await expect(errorMessage).toBeVisible()
}
