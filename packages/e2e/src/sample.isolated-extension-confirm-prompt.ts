import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-confirm-prompt'

export const test: Test = async ({ Extension, Locator, QuickPick, expect }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  await QuickPick.open()
  await QuickPick.setValue('>isolatedConfirmPromptSample')
  // @ts-ignore older published test-worker types don't include waitUntil yet
  await QuickPick.selectItem('Isolated Confirm Prompt Sample', { waitUntil: 'quickPick' })

  const dialog = Locator('.DialogContent')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.DialogHeading')).toHaveText('WSL')
  await expect(dialog.locator('.DialogMessage')).toHaveText('WSL is not installed.')
  await dialog.locator('button[name="Confirm"]').click()
  await expect(dialog).toBeHidden()

  const confirmDialog = Locator('.DialogContent')
  await expect(confirmDialog).toBeVisible()
  await expect(confirmDialog.locator('.DialogHeading')).toHaveText('WSL')
  await expect(confirmDialog.locator('.DialogMessage')).toHaveText('Continue?')
  await confirmDialog.locator('button[name="Cancel"]').click()
  await expect(confirmDialog).toBeHidden()

  const resultDialog = Locator('.DialogContent')
  await expect(resultDialog).toBeVisible()
  await expect(resultDialog.locator('.DialogHeading')).toHaveText('Confirmation result')
  await expect(resultDialog.locator('.DialogMessage')).toHaveText('Cancelled')
  await resultDialog.locator('button[name="Confirm"]').click()
  await expect(resultDialog).toBeHidden()
}
