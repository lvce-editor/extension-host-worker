import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { formatDocument, getDiagnostics, showCompletions } from '../../../src/parts/Editor/Editor.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('executes active editor commands', async () => {
  const diagnostics = [{ columnIndex: 1, endColumnIndex: 2, endRowIndex: 0, message: 'Unexpected semicolon', rowIndex: 0, type: 'warning' }]
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      if (id === 'GetActiveEditor.getDiagnostics') {
        return diagnostics
      }
      return undefined
    },
  })

  await formatDocument()
  deepStrictEqual(await getDiagnostics(), diagnostics)
  await showCompletions()

  deepStrictEqual(invocations, [['Editor.format'], ['GetActiveEditor.getDiagnostics'], ['Editor.openCompletion']])
})
