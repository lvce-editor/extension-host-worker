import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-pick-cancel'

export const skip = 1

export const test: Test = async ({ Extension, Locator, QuickPick, expect }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/sample.quick-pick'))

  const result = Locator('.StatusBarItem[name="quickpick.result"]')
  await expect(result).toBeVisible()
  await expect(result).toHaveText('idle')

  await QuickPick.open()
  await QuickPick.setValue('>quickPickBranches')
  await QuickPick.selectItem('Quick Pick Branches')

  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  const input = quickPick.locator('input')
  // @ts-ignore
  await input.press('Escape')

  await expect(quickPick).not.toBeVisible()
  await expect(result).toHaveText('canceled')
}
