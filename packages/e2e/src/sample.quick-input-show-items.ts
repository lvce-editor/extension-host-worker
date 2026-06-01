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
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()
  await expect(quickPick.locator('text=Option 1')).toHaveText('Option 1')
  await expect(quickPick.locator('text=Option 2')).toHaveText('Option 2')
  await expect(quickPick.locator('text=Option 3')).toHaveText('Option 3')
}
