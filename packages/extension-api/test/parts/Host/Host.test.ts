import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  closeUri,
  confirm,
  getRecentlyOpenedWorkspaceUris,
  getWorkspaceFolder,
  getWorkspaceUri,
  handleWorkspaceRefresh,
  openUri,
  setWorkspaceUri,
  showErrorMessage,
  showNotification,
} from '../../../src/parts/Host/Host.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('setWorkspaceUri forwards the workspace uri', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      return undefined
    },
  })
  await setWorkspaceUri('remote-ssh:///test-folder')

  deepStrictEqual(invocations, [['Workspace.setUri', 'remote-ssh:///test-folder']])
})

test('host helpers execute renderer commands through extension management', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      if (id === 'Workspace.getPath') {
        return '/workspace'
      }
      if (id === 'Workspace.getUri') {
        return 'file:///workspace'
      }
      if (id === 'RecentlyOpened.getRecentlyOpened') {
        return ['file:///projects/one', 'remote-ssh://host/projects/two']
      }
      if (id === 'ConfirmPrompt.prompt') {
        return true
      }
      return undefined
    },
    async 'Extensions.showNotification'(type: string, message: string): Promise<void> {
      invocations.push(['Extensions.showNotification', type, message])
    },
  })

  strictEqual(await getWorkspaceFolder(), '/workspace')
  strictEqual(await getWorkspaceUri(), 'file:///workspace')
  deepStrictEqual(await getRecentlyOpenedWorkspaceUris(), ['file:///projects/one', 'remote-ssh://host/projects/two'])
  strictEqual(await confirm('Discard changes?'), true)
  strictEqual(await confirm('Discard changes?', { cancelMessage: 'Keep', confirmMessage: 'Discard', title: 'Editor' }), true)
  await showErrorMessage('WSL is not installed.', { title: 'WSL' })
  await handleWorkspaceRefresh()
  await handleWorkspaceRefresh({ reloadAll: true })
  await openUri('/workspace/file.txt')
  await closeUri('/workspace/file.txt')
  await setWorkspaceUri('remote-ssh:///test-folder')
  await showNotification('info', 'File created successfully')

  deepStrictEqual(invocations, [
    ['Workspace.getPath'],
    ['Workspace.getUri'],
    ['RecentlyOpened.getRecentlyOpened'],
    ['ConfirmPrompt.prompt', 'Discard changes?'],
    ['ConfirmPrompt.prompt', 'Discard changes?', { cancelMessage: 'Keep', confirmMessage: 'Discard', title: 'Editor' }],
    ['ConfirmPrompt.showErrorMessage', { message: 'WSL is not installed.', title: 'WSL' }],
    ['Layout.handleWorkspaceRefresh'],
    ['Layout.handleWorkspaceRefresh', { reloadAll: true }],
    ['Main.openUri', '/workspace/file.txt'],
    ['Main.closeTabsByUris', ['/workspace/file.txt']],
    ['Workspace.setUri', 'remote-ssh:///test-folder'],
    ['Extensions.showNotification', 'info', 'File created successfully'],
  ])
})

test('confirm preserves a cancelled result', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(): Promise<unknown> {
      return false
    },
  })

  strictEqual(await confirm('Continue?'), false)
})

test('showErrorMessage propagates transport errors', async () => {
  const error = new Error('Dialog transport failed')
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(): Promise<unknown> {
      throw error
    },
  })

  await rejects(showErrorMessage('WSL is not installed.', { title: 'WSL' }), error)
})
