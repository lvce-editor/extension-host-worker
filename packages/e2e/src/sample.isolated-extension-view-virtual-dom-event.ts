import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-virtual-dom-event'

export const skip = true

export const test: Test = async ({ ActivityBar, Command, expect, Extension, Locator }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  await ActivityBar.toggleActivityBarItem('sample.views.virtualDomEvent')

  const input = Locator('input[name="message"]')
  await expect(input).toBeVisible()
  await Command.execute('Extensions.dispatchViewEvent', 'sample.views.virtualDomEvent', 1, {
    name: 'message',
    type: 'input',
    value: 'hello virtual dom',
  })
  await Command.execute('Extensions.dispatchViewEvent', 'sample.views.virtualDomEvent', 1, {
    name: 'applyMessage',
    type: 'click',
  })

  const draft = Locator('text=Draft: hello virtual dom')
  const submitted = Locator('text=Submitted: hello virtual dom')
  await expect(draft).toBeVisible()
  await expect(submitted).toBeVisible()
}
