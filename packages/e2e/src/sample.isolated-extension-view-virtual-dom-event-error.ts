import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-virtual-dom-event-error'

export const skip = true

export const test: Test = async ({ ActivityBar, Command, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.virtualDomEventError')

  await Command.execute('Extensions.dispatchViewEvent', 'sample.views.virtualDomEventError', 1, {
    name: 'failEvent',
    type: 'click',
  })

  const errorMessage = Locator('text=event failed')
  await expect(errorMessage).toBeVisible()
}
