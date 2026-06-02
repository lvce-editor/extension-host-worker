import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-output-channel-live-update'

export const skip = true

export const test: Test = async ({ Command, expect, Extension, Locator, Output, Panel, QuickPick }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  await Panel.open('Output')
  await Command.execute('Panel.selectIndex', 1)
  await Output.selectChannel('sample.output.live')

  const content = Locator('.OutputContent')
  await expect(content).toHaveText('before command')

  await QuickPick.open()
  await QuickPick.setValue('>Append Output Line')
  await QuickPick.selectItem('Append Output Line')

  await expect(content).toHaveText('before command\nafter command')
}
