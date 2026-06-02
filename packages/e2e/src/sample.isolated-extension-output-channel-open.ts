import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-output-channel-open'

export const skip = true

export const test: Test = async ({ Command, expect, Extension, Locator, Output, Panel }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  await Panel.open('Output')
  await Command.execute('Panel.selectIndex', 1)
  await Output.selectChannel('sample-output-open')

  const outputSelect = Locator('[name="output"]')
  const outputContent = Locator('.OutputContent')
  await expect(outputSelect).toHaveValue('sample-output-open')
  await expect(outputContent).toHaveText('extension started\nready')
}
