import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-virtual-dom-hello-world'

export const skip = true

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const item = Locator('.ActivityBarItem[title="Hello World"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveAttribute('aria-selected', 'false')

  await ActivityBar.toggleActivityBarItem('sample.views.virtualDomHelloWorld')

  const heading = Locator('h1')
  const iframe = Locator('iframe.ExtensionViewIframe[title="Hello World"]')
  await expect(item).toHaveAttribute('aria-selected', 'true')
  await expect(heading).toBeVisible()
  await expect(heading).toHaveText('Hello world')
  await expect(iframe).not.toBeVisible()
}
