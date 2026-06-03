import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-diagnostic-provider'

export const skip = true

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await Command.execute('ExtensionHostTextDocument.syncFull', '/test.xyz', 1, 'xyz', 'hello error')

  const diagnostics = await Command.execute('ExtensionHost.executeDiagnosticProvider', 1)

  if (
    JSON.stringify(diagnostics) !==
    JSON.stringify([
      {
        rowIndex: 0,
        columnIndex: 6,
        endRowIndex: 0,
        endColumnIndex: 11,
        message: 'isolated diagnostic result',
        source: 'isolated',
        type: 'error',
      },
    ])
  ) {
    throw new Error(`Expected diagnostic result to be displayed but got ${JSON.stringify(diagnostics)}`)
  }
}
