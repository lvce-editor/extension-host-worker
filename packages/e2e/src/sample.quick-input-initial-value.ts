import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input'

export const skip = true

export const test: Test = async ({ Main, Extension, Locator, expect, QuickPick }) => {
  await Main.closeAllEditors()
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await QuickPick.open()
  await QuickPick.setValue('>quickPickSample')

  // act
  // @ts-ignore older published test-worker types don't include waitUntil yet
  await QuickPick.selectItem('Quick Pick Sample', { waitUntil: 'quickPick' })

  // assert
  const quickPickInput = Locator('.QuickPick input')
  await expect(quickPickInput).toBeVisible()
  await expect(quickPickInput).toHaveValue('test')
}
