import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-filesystem-write-file'

export const test: Test = async ({ Command, Extension, FileSystem }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  const tmpDir = await FileSystem.getTmpDir()
  const targetUri = `${tmpDir}/filesystem-write-file.txt`
  await Extension.addWebExtension(uri)

  await Command.execute('ExtensionHost.executeCommand', 'isolatedFilesystem.writeFile', targetUri, 'filesystem api write')

  await FileSystem.shouldHaveFile(targetUri, 'filesystem api write')
}
