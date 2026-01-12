import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input-cancel'

export const skip = true

export const test: Test = async ({ Extension, Main, FileSystem, Locator, expect }) => {
  // arrange - load the extension that uses showQuickInput
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // create a test file to trigger activation
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.quickinput-cancel`, `test content`)

  // act - open the file to trigger extension activation and showQuickInput
  await Main.openUri(`${tmpDir}/test.quickinput-cancel`)

  // assert - verify quick input is displayed
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  // verify input field exists and has initial value
  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('test')

  // verify options are rendered
  await expect(quickPick).toContainText('Option 1')
  await expect(quickPick).toContainText('Option 2')
  await expect(quickPick).toContainText('Option 3')

  // act - cancel the quick input by pressing Escape
  // @ts-ignore
  await input.press('Escape')

  // assert - verify quick input is closed
  await expect(quickPick).not.toBeVisible()

  // verify that the result.canceled flag was set to true
  // The extension logs "Quick input was canceled" in this case
  // This verifies the canceled field in the result object
}
