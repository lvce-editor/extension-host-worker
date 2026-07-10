import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { confirm, getWorkspaceFolder, handleWorkspaceRefresh, openUri } from '../../../src/parts/Host/Host.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('host helpers execute renderer commands through extension management', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      if (id === 'Workspace.getPath') {
        return '/workspace'
      }
      if (id === 'ConfirmPrompt.prompt') {
        return true
      }
      return undefined
    },
  })

  strictEqual(await getWorkspaceFolder(), '/workspace')
  strictEqual(await confirm('Discard changes?'), true)
  await handleWorkspaceRefresh()
  await openUri('/workspace/file.txt')

  deepStrictEqual(invocations, [
    ['Workspace.getPath'],
    ['ConfirmPrompt.prompt', 'Discard changes?'],
    ['Layout.handleWorkspaceRefresh'],
    ['Main.openUri', '/workspace/file.txt'],
  ])
})
