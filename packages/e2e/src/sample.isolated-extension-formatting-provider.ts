import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-formatting-provider'

const assertFormattingEdits = (actual: unknown): void => {
  const expected = [{ endOffset: 13, inserted: 'const value = 1', startOffset: 0 }]
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected formatting edits ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`)
  }
}

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await Command.execute('ExtensionHostTextDocument.syncFull', '/test.js', 1, 'javascript', 'const value=1')
  const edits = await Command.execute('ExtensionHostFormatting.executeFormattingProvider', 1)
  assertFormattingEdits(edits)
}
