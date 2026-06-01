import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input-cancel'

export const skip = true

export const test: Test = async ({ Extension, Main, FileSystem, Locator, expect }) => {
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // create a test file to trigger activation
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.quickinput-cancel`, `test content`)

  // act - open the file to trigger extension activation
  await Main.openUri(`${tmpDir}/test.quickinput-cancel`)

  // assert - verify quick pick is displayed
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('placeholder', 'Select option')

  // verify options are rendered
  await expect(quickPick).toContainText('Option 1')
  await expect(quickPick).toContainText('Option 2')
  await expect(quickPick).toContainText('Option 3')

  // act - cancel the quick pick by pressing Escape
  // @ts-ignore
  await input.press('Escape')

  // assert - verify quick pick is closed
  await expect(quickPick).not.toBeVisible()

  // The extension logs "Quick pick was canceled" in this case.
}
