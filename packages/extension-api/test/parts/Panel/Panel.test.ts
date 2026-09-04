import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { openDebugConsole, openOutputView, openProblemsView } from '../../../src/parts/Panel/Panel.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('opens panel views with options', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      return undefined
    },
  })

  await openProblemsView({ filter: 'typescript' })
  await openOutputView({ channel: 'Window' })
  await openDebugConsole({ input: 'process.version' })

  deepStrictEqual(invocations, [
    ['Layout.openProblems', 'typescript'],
    ['Layout.openOutput', 'Window'],
    ['Layout.openDebugConsole', 'process.version'],
  ])
})

test('opens panel views without replacing their current options', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      return undefined
    },
  })

  await openProblemsView()
  await openOutputView()
  await openDebugConsole()

  deepStrictEqual(invocations, [
    ['Layout.openProblems', undefined],
    ['Layout.openOutput', undefined],
    ['Layout.openDebugConsole', undefined],
  ])
})
