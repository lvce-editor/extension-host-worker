import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input'

// export const skip = true

export const test: Test = async ({ Main, Extension, Locator, expect, QuickPick }) => {
  await Main.closeAllEditors()
  // arrange - load the extension that uses showQuickInput
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await QuickPick.open()
  await QuickPick.setValue('>quickPickSample')
  // @ts-ignore older published test-worker types don't include waitUntil yet
  await QuickPick.selectItem('Quick Pick Sample', { waitUntil: 'quickPick' })

  // assert - verify quick input is displayed
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  // verify input field exists and has initial value
  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('test')

  // verify that initial options are rendered
  await expect(quickPick.locator('text=Option 1')).toHaveText('Option 1')
  await expect(quickPick.locator('text=Option 2')).toHaveText('Option 2')
  await expect(quickPick.locator('text=Option 3')).toHaveText('Option 3')

  // test dynamic rendering by typing
  await QuickPick.setValue('search')
  await expect(quickPick.locator('text=Search: search')).toHaveText('Search: search')

  await QuickPick.selectItem('Option 1')

  // verify quick input is closed after selection
  await expect(quickPick).not.toBeVisible()
}
