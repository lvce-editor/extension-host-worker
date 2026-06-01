import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-pick'

export const skip = 1

export const test: Test = async ({ Extension, Locator, QuickPick, expect }) => {
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))

  const result = Locator('.StatusBarItem[name="quickpick.result"]')
  await expect(result).toBeVisible()
  await expect(result).toHaveText('idle')

  await QuickPick.open()
  await QuickPick.setValue('>quickPickBranches')
  await QuickPick.selectItem('Quick Pick Branches')

  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  const input = quickPick.locator('input')
  await expect(input).toHaveAttribute('placeholder', 'Select branch')

  await expect(quickPick).toContainText('main')
  await expect(quickPick).toContainText('Default branch')
  await expect(quickPick).toContainText('feature/search')
  await expect(quickPick).toContainText('Remote branch')

  await QuickPick.selectItem('feature/search')

  await expect(quickPick).not.toBeVisible()
  await expect(result).toHaveText('feature/search')
}
