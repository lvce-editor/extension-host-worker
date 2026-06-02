import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input-invalid-initial-value'

export const skip = true

export const test: Test = async ({ Extension, FileSystem, Locator, Main }) => {
  // arrange - load the extension that passes an invalid quick pick item
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // create a test file to trigger activation
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.quickinput-invalid-initial-value`, `test content`)

  // act - open the file to trigger extension activation
  await Main.openUri(`${tmpDir}/test.quickinput-invalid-initial-value`)

  // assert - verify error is handled gracefully
  // The extension should either throw an error or handle it gracefully
  // We can check if an error dialog appears or if the quick pick doesn't show
  const quickPick = Locator('.QuickPick')

  const input = quickPick.locator('input')

  // @ts-ignore
  await input.inputValue()
}
