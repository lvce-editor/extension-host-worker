import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input'

export const skip = true

export const test: Test = async ({ Extension, Locator, expect, QuickPick }) => {
  // arrange - load the extension that uses showQuickInput
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await QuickPick.open()
  await QuickPick.setValue('>quickPickSample')
  await QuickPick.selectItem('Quick Pick Sample')

  // TODO the way quickpick currently works, we cannot check the intermediate state,
  // since the promise only resolves once the inner command also has finished
  // at which point the quickpick is already closed

  // assert - verify quick input is displayed
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  // verify input field exists and has initial value
  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('test')

  // verify that initial options are rendered
  await expect(quickPick).toContainText('Option 1')
  await expect(quickPick).toContainText('Option 2')
  await expect(quickPick).toContainText('Option 3')

  // test dynamic rendering by typing
  // @ts-ignore
  await input.fill('search')
  await expect(quickPick).toContainText('Search: search')

  // select the first option by clicking
  const firstOption = quickPick.locator('text=Option 1')
  // @ts-ignore
  await firstOption.click()

  // verify quick input is closed after selection
  await expect(quickPick).not.toBeVisible()
}
