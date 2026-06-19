import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-filesystem-exists'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const exists = await Command.execute('ExtensionHost.executeCommand', 'isolatedFilesystem.exists')

  if (exists !== true) {
    throw new Error(`Expected filesystem exists result true, got ${JSON.stringify(exists)}`)
  }
}
