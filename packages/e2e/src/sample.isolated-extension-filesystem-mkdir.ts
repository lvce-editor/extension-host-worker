import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-filesystem-mkdir'

export const test: Test = async ({ Command, Extension, FileSystem }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  const tmpDir = await FileSystem.getTmpDir()
  const targetUri = `${tmpDir}/filesystem-mkdir`
  await Extension.addWebExtension(uri)

  await Command.execute('ExtensionHost.executeCommand', 'isolatedFilesystem.mkdir', targetUri)

  await FileSystem.shouldHaveFolder(targetUri)
}
