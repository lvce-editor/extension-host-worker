import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-quick-input'

export const skip = true

export const test: Test = async ({ expect, Extension, Locator, QuickPick }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  await QuickPick.open()
  await QuickPick.setValue('>isolatedQuickPickSample')
  // @ts-ignore older published test-worker types don't include waitUntil yet
  await QuickPick.selectItem('Isolated Quick Pick Sample', { waitUntil: 'quickPick' })

  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('placeholder', 'Select isolated option')

  await expect(quickPick.locator('text=Isolated Option 1')).toHaveText('Isolated Option 1')
  await expect(quickPick.locator('text=Isolated Option 2')).toHaveText('Isolated Option 2')
  await expect(quickPick.locator('text=Isolated Option 3')).toHaveText('Isolated Option 3')

  await QuickPick.selectItem('Isolated Option 1')

  await expect(quickPick).toBeHidden()
}
