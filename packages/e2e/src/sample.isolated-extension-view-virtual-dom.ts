import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-virtual-dom'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="Virtual DOM"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveAttribute('aria-selected', 'false')

  await ActivityBar.toggleActivityBarItem('sample.views.virtualDom')

  const title = Locator('text=Virtual DOM Sample View')
  const uid = Locator('text=Context uid:')
  const description = Locator('text=Rendered by an isolated extension')
  await expect(item).toHaveAttribute('aria-selected', 'true')
  await expect(title).toBeVisible()
  await expect(uid).toBeVisible()
  await expect(description).toBeVisible()
}
