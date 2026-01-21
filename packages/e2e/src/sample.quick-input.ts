import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input'

export const skip = true

export const test: Test = async ({ Extension, Locator, expect, QuickPick }) => {
  // arrange
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await QuickPick.open()
  await QuickPick.setValue('>quickPickSample')

  // act
  await QuickPick.selectItem('Quick Pick Sample')

  // assert
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()
  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('test')
}
