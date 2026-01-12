import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.quick-input'

export const skip = true

export const test: Test = async ({ Extension, Main, FileSystem, Locator, expect }) => {
  // arrange - load the extension that uses showQuickInput
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // create a test file with the quickinput language to trigger activation
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.quickinput`, `test content`)

  // act - open the file to trigger extension activation and showQuickInput
  await Main.openUri(`${tmpDir}/test.quickinput`)

  // assert - verify quick input is displayed
  const quickPick = Locator('.QuickPick')
  await expect(quickPick).toBeVisible()

  // verify input field exists and has initial value
  const input = quickPick.locator('input')
  await expect(input).toBeVisible()
  await expect(input).toHaveValue('test')

  // verify that initial options are rendered
  await expect(quickPick).toContainText('Option 1')
  await expect(quickPick).toContainText('Option 2')
  await expect(quickPick).toContainText('Option 3')

  // test dynamic rendering by typing
  // @ts-ignore
  await input.fill('search')
  await expect(quickPick).toContainText('Search: search')

  // select the first option by clicking
  const firstOption = quickPick.locator('text=Option 1')
  // @ts-ignore
  await firstOption.click()

  // verify quick input is closed after selection
  await expect(quickPick).not.toBeVisible()
}
