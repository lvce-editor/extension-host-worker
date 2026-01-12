import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input-invalid-render'

export const skip = true

export const test: Test = async ({ Extension, Main, FileSystem, Locator, expect }) => {
  // arrange - load the extension that passes a non-function to render
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // create a test file to trigger activation
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.quickinput-invalid-render`, `test content`)

  // act - open the file to trigger extension activation
  await Main.openUri(`${tmpDir}/test.quickinput-invalid-render`)

  // assert - verify error is handled
  // The API should throw an error when render is not a function
  const errorDialog = Locator('.Dialog')
  // @ts-ignore
  const quickPick = Locator('.QuickPick')

  // Either an error dialog should appear or the quick input should not show
  await expect(errorDialog).toBeVisible()
  await expect(errorDialog).toContainText('error')

  // Check console for error message
  // The extension's catch block should log the error
}
