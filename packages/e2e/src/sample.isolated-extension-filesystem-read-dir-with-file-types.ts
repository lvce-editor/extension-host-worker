import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-filesystem-read-dir-with-file-types'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const names = await Command.execute('ExtensionHost.executeCommand', 'isolatedFilesystem.readDirWithFileTypes')

  if (!Array.isArray(names) || !names.includes('sample.txt')) {
    throw new Error(`Expected filesystem readDirWithFileTypes result to include sample.txt, got ${JSON.stringify(names)}`)
  }
}
