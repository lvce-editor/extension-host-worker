import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-filesystem-read-file'

export const skip = true

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const text = await Command.execute('ExtensionHost.executeCommand', 'isolatedFilesystem.readFile')

  if (text !== 'filesystem api\n') {
    throw new Error(`Expected filesystem readFile result ${JSON.stringify('filesystem api\n')}, got ${JSON.stringify(text)}`)
  }
}
