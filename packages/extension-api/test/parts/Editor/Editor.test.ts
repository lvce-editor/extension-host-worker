import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  formatDocument,
  getActiveEditor,
  getDiagnostics,
  getEditorSelections,
  setEditorSelections,
  showCompletions,
} from '../../../src/parts/Editor/Editor.ts'

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
      if (id === 'GetActiveEditor.getSelections') {
        return [1, 2, 3, 4, 5, 6, 7, 8]
      }
      return undefined
    },
  })

  await formatDocument()
  deepStrictEqual(await getDiagnostics(), diagnostics)
  deepStrictEqual(await getEditorSelections(), [
    { endColumnIndex: 4, endRowIndex: 3, startColumnIndex: 2, startRowIndex: 1 },
    { endColumnIndex: 8, endRowIndex: 7, startColumnIndex: 6, startRowIndex: 5 },
  ])
  await setEditorSelections([{ endColumnIndex: 12, endRowIndex: 10, startColumnIndex: 4, startRowIndex: 9 }])
  await showCompletions()

  deepStrictEqual(invocations, [
    ['Editor.format'],
    ['GetActiveEditor.getDiagnostics'],
    ['GetActiveEditor.getSelections'],
    ['GetActiveEditor.setSelections', [9, 4, 10, 12]],
    ['Editor.openCompletion'],
  ])
})

test('getActiveEditor returns the application editor snapshot or undefined', async () => {
  let activeEditor: { id: number; uri: string } | undefined = { id: 42, uri: 'memfs:///preview.css' }
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string): Promise<unknown> {
      deepStrictEqual(id, 'GetActiveEditor.getActiveEditorInfo')
      return activeEditor
    },
  })
  deepStrictEqual(await getActiveEditor(), activeEditor)
  activeEditor = undefined
  deepStrictEqual(await getActiveEditor(), undefined)
})
