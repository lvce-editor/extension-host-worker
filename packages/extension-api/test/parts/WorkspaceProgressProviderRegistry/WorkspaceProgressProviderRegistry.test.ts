import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual, throws } from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import {
  getWorkspaceProgressData,
  registerWorkspaceProgressProvider,
  resetWorkspaceProgressProviderRegistry,
} from '../../../src/parts/WorkspaceProgressProviderRegistry/WorkspaceProgressProviderRegistry.ts'

let mockRpc: { [Symbol.dispose](): void } | undefined
let notifications = 0

beforeEach(() => {
  notifications = 0
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    'WorkspaceProgress.handleChange'(): void {
      notifications++
    },
  })
})

afterEach(() => {
  resetWorkspaceProgressProviderRegistry()
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('registers, queries, refreshes, and disposes a workspace progress provider', async () => {
  let message = 'Starting the remote server…'
  const handle = registerWorkspaceProgressProvider({
    getProgressData() {
      return { message, status: 'in-progress' }
    },
    id: 'sample.workspace',
  })

  deepStrictEqual(await getWorkspaceProgressData(), [{ message, status: 'in-progress' }])
  message = 'Connected'
  await handle.refresh()
  strictEqual(notifications, 2)
  deepStrictEqual(await getWorkspaceProgressData(), [{ message, status: 'in-progress' }])

  await handle.dispose()
  const remainingProgressData = await getWorkspaceProgressData()
  strictEqual(remainingProgressData.length, 0)
})

test('rejects duplicate ids and invalid progress data without returning it', async () => {
  registerWorkspaceProgressProvider({
    getProgressData() {
      return { message: 42, status: 'starting' } as never
    },
    id: 'sample.workspace',
  })
  throws(
    () => registerWorkspaceProgressProvider({ getProgressData: () => ({ message: '', status: 'idle' }), id: 'sample.workspace' }),
    /already registered/,
  )
  const progressData = await getWorkspaceProgressData()
  deepStrictEqual(progressData, [])
})
