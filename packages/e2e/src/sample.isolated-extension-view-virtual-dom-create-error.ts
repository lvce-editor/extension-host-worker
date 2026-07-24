import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-virtual-dom-create-error'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.virtualDomCreateError')

  const error = Locator('.Viewlet.Error')
  await expect(error).toBeVisible()
  await expect(error).toContainText('Error: create failed')
  await expect(error).toContainText("throw new Error('create failed')")
  await expect(error).toContainText('at create (')
}
