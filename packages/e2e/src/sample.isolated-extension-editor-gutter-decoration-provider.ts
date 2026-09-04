import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-editor-gutter-decoration-provider'

export const test: Test = async ({ Command, Extension }) => {
  await Extension.addWebExtension(import.meta.resolve(`../fixtures/${name}`))

  const decorations = await Command.execute(
    'ExtensionHost.executeCommand',
    'isolatedEditorGutterDecoration.getDecorations',
    'added\nmodified\ndeleted',
    'file:///workspace/file.txt',
  )
  const expected = [
    { rowIndex: 0, type: 'added' },
    { rowIndex: 1, type: 'modified' },
    { rowIndex: 2, type: 'deleted' },
  ]
  if (JSON.stringify(decorations) !== JSON.stringify(expected)) {
    throw new Error(`Expected isolated editor gutter decorations, got ${JSON.stringify(decorations)}`)
  }
}
