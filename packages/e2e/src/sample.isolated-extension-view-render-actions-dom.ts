import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-render-actions-dom'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.renderActionsDom')

  const action = Locator('.CustomSidebarAction')
  await expect(action).toBeVisible()
  await expect(action).toHaveText('Custom action')
}
