import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-filesystem-remove'

export const skip = true

export const test: Test = async ({ Command, Extension, FileSystem }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  const tmpDir = await FileSystem.getTmpDir()
  const targetUri = `${tmpDir}/filesystem-remove.txt`
  await FileSystem.writeFile(targetUri, 'remove me')
  await Extension.addWebExtension(uri)

  await Command.execute('ExtensionHost.executeCommand', 'isolatedFilesystem.remove', targetUri)

  const dirents = await FileSystem.readDir(tmpDir)
  if (dirents.some((dirent) => dirent.name === 'filesystem-remove.txt')) {
    throw new Error(`Expected filesystem remove to delete ${targetUri}`)
  }
}
