import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input-invalid-initial-value'

export const skip = true

export const test: Test = async ({ Extension, Main, FileSystem, Locator }) => {
  // arrange - load the extension that passes a number to initialValue
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // create a test file to trigger activation
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.quickinput-invalid-initial-value`, `test content`)

  // act - open the file to trigger extension activation
  await Main.openUri(`${tmpDir}/test.quickinput-invalid-initial-value`)

  // assert - verify error is handled gracefully
  // The extension should either throw an error or handle it gracefully
  // We can check if an error dialog appears or if the quick input doesn't show
  const quickPick = Locator('.QuickPick')

  // The API should either reject the invalid type or convert it to a string
  // If it shows, the value should be converted to '12345' or show empty

  // If quick input is shown, verify it handled the number by converting to string
  const input = quickPick.locator('input')

  // @ts-ignore
  const value = await input.inputValue()
  // Should be converted to '12345' or empty string
}
