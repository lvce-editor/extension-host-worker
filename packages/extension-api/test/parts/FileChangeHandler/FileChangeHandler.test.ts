import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import { handleFileChanges, registerFileChangeHandler, resetFileChangeHandlers } from '../../../src/parts/FileChangeHandler/FileChangeHandler.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined
let registrations: string[] = []

beforeEach(() => {
  registrations = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.registerFileChangeHandler'(): void {
      registrations.push('register')
    },
    'Extensions.unregisterFileChangeHandler'(): void {
      registrations.push('unregister')
    },
  })
})

afterEach(() => {
  resetFileChangeHandlers()
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('registerFileChangeHandler registers once and dispatches changes to all handlers', async () => {
  const received: unknown[] = []
  registerFileChangeHandler((changes) => {
    received.push(['first', changes])
  })
  registerFileChangeHandler(async (changes) => {
    received.push(['second', changes])
  })
  const changes = {
    changed: ['file:///workspace/main.ts'],
    deleted: ['file:///workspace/old.ts'],
    renamed: [['file:///workspace/before.ts', 'file:///workspace/after.ts']] as const,
  }

  await handleFileChanges(changes)

  deepStrictEqual(registrations, ['register'])
  deepStrictEqual(received, [
    ['first', changes],
    ['second', changes],
  ])
})

test('registerFileChangeHandler unregisters after the last handler is disposed', () => {
  const first = registerFileChangeHandler(() => {})
  const second = registerFileChangeHandler(() => {})

  first.dispose()
  deepStrictEqual(registrations, ['register'])
  second.dispose()
  second.dispose()

  deepStrictEqual(registrations, ['register', 'unregister'])
})

test('registerFileChangeHandler rejects invalid and duplicate handlers', () => {
  throws(() => {
    // @ts-expect-error testing an invalid handler
    registerFileChangeHandler(undefined)
  }, /file change handler must be a function/)

  const handler = (): void => {}
  registerFileChangeHandler(handler)
  throws(() => registerFileChangeHandler(handler), /file change handler is already registered/)
})

test('handleFileChanges waits for handlers and forwards failures', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  let completed = false
  registerFileChangeHandler(async () => {
    await promise
    completed = true
  })

  const handling = handleFileChanges()
  strictEqual(completed, false)
  resolve()
  await handling
  strictEqual(completed, true)

  resetFileChangeHandlers()
  registerFileChangeHandler(async () => {
    throw new Error('listener failed')
  })
  await rejects(() => handleFileChanges(), /listener failed/)
})
