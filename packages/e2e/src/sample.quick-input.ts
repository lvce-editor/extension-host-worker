import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input'

// export const skip = true

export const test: Test = async ({ Extension, Locator, expect, QuickPick, Command }) => {
  // arrange - load the extension that uses showQuickInput
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))
  await QuickPick.open()
  await QuickPick.setValue('>quickPickSample')

  // @ts-ignore
  await QuickPick.selectItem2({
    label: 'Quick Pick Sample',
    waitUntil: 'visible',
    // visibleCallback: 'testCallback.resolve',
  })

  console.log('done')

  // await using callback = await Command.registerCallback('testCallback.resolve')
  // QuickPick.selectItem('Quick Pick Sample')

  // TODO the way quickpick currently works, we cannot check the intermediate state,
  // since the promise only resolves once the inner command also has finished
  // at which point the quickpick is already closed

  // await callback.promise

  // assert - verify quick input is displayed
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  // verify input field exists and has initial value
  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('test')
}
