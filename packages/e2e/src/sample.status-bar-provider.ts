import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.status-bar-provider'

export const skip = 1

export const test: Test = async ({ Extension, FileSystem }) => {
  // arrange
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  // @ts-ignore
  const tmpDir = await FileSystem.getTmpDir()

  // assert
  // TODO wait for status bar item to be visible
}
