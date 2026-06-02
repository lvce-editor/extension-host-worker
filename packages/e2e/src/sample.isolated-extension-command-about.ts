import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-command-about'

export const test: Test = async ({ Command, Extension, Locator, expect }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  await Command.execute('ExtensionHost.executeCommand', 'isolatedAbout.openAbout')

  const dialogContent = Locator('.DialogContent')
  await expect(dialogContent).toBeVisible()
  const infoIcon = dialogContent.locator('.DialogInfoIcon')
  await expect(infoIcon).toBeVisible()
}
