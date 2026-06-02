import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-output-channel-visible'

export const skip = true

export const test: Test = async ({ Command, expect, Extension, Locator, Panel }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  await Panel.open('Output')
  await Command.execute('Panel.selectIndex', 1)

  const option = Locator('[name="output"] option[value="sample-output-visible"]')
  await expect(option).toHaveText('Sample Output Visible')
}
