import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeDebugEvaluate,
  executeDebugGetCallStack,
  executeDebugGetPausedStatus,
  executeDebugGetProperties,
  executeDebugGetScripts,
  executeDebugGetScriptSource,
  executeDebugListProcesses,
  executeDebugPause,
  executeDebugResume,
  executeDebugSetPauseOnExceptions,
  executeDebugStart,
  executeDebugStep,
  executeDebugStepInto,
  executeDebugStepOut,
  executeDebugStepOver,
  registerDebugProvider,
  resetDebugProviderRegistry,
  type DebugEmitter,
  type DebugProvider,
} from '../../../src/parts/Debug/Debug.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

const createProvider = (overrides: Partial<DebugProvider> = {}): DebugProvider => {
  return {
    evaluate: () => 'evaluate',
    getCallStack: () => ['frame-1'],
    getProperties: () => 'properties',
    getScripts: () => ['script-1'],
    getScriptSource: (scriptId) => `source:${scriptId}`,
    getStatus: () => ({ status: 'unavailable' }),
    id: 'node-debug',
    listProcesses: () => [],
    pause: () => 'pause',
    resume: () => 'resume',
    setPauseOnExceptions: () => 'set-pause',
    start: () => 'start',
    step: () => 'step',
    stepInto: () => 'step-into',
    stepOut: () => 'step-out',
    stepOver: () => 'step-over',
    ...overrides,
  }
}

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
  resetDebugProviderRegistry()
})

test('registerDebugProvider exposes provider methods', async () => {
  registerDebugProvider(createProvider())

  deepStrictEqual(await executeDebugListProcesses('node-debug', '/workspace'), [])
  strictEqual(await executeDebugPause('node-debug'), 'pause')
  strictEqual(await executeDebugResume('node-debug'), 'resume')
  strictEqual(await executeDebugStep('node-debug'), 'step')
  strictEqual(await executeDebugStepInto('node-debug'), 'step-into')
  strictEqual(await executeDebugStepOut('node-debug'), 'step-out')
  strictEqual(await executeDebugStepOver('node-debug'), 'step-over')
  strictEqual(await executeDebugSetPauseOnExceptions('node-debug', 2), 'set-pause')
  strictEqual(await executeDebugGetProperties('node-debug', 'object-1'), 'properties')
  strictEqual(await executeDebugEvaluate('node-debug', '1 + 1', 'frame-1'), 'evaluate')
  deepStrictEqual(await executeDebugGetCallStack('node-debug'), ['frame-1'])
  deepStrictEqual(await executeDebugGetPausedStatus('node-debug'), { status: 'unavailable' })
  deepStrictEqual(await executeDebugGetScripts('node-debug'), ['script-1'])
  strictEqual(await executeDebugGetScriptSource('node-debug', 'script-1'), 'source:script-1')
})

test('executeDebugStart supplies a host event emitter', async () => {
  const invocations: unknown[][] = []
  let receivedEmitter: DebugEmitter | undefined
  let receivedPath: string | undefined
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...params: readonly unknown[]): Promise<void> {
      invocations.push([id, ...params])
    },
  })
  registerDebugProvider(
    createProvider({
      async start(emitter, path) {
        receivedEmitter = emitter
        receivedPath = path
      },
    }),
  )

  await executeDebugStart('node-debug', '/workspace')
  strictEqual(receivedPath, '/workspace')
  await receivedEmitter!.handlePaused({ reason: 'breakpoint' })
  await receivedEmitter!.handleResumed()
  await receivedEmitter!.handleScriptParsed({ scriptId: '1' })
  await receivedEmitter!.handleChange({ type: 'paused' })
  deepStrictEqual(invocations, [['Debug.paused', { reason: 'breakpoint' }], ['Debug.resumed'], ['Debug.scriptParsed', { scriptId: '1' }]])
})

test('registerDebugProvider returns a disposable registration', async () => {
  const disposable = registerDebugProvider(createProvider())
  disposable.dispose()
  await rejects(executeDebugPause('node-debug'), /debug provider node-debug not found/)
})

test('registerDebugProvider rejects invalid registrations', () => {
  throws(() => registerDebugProvider(undefined as never), /debug provider is not defined/)
  throws(() => registerDebugProvider(createProvider({ id: '' })), /debug provider is missing id/)
  throws(() => registerDebugProvider(createProvider({ pause: undefined as never })), /debug provider node-debug is missing pause function/)
})

test('registerDebugProvider rejects duplicate ids', () => {
  registerDebugProvider(createProvider())
  throws(() => registerDebugProvider(createProvider()), /debug provider node-debug is already registered/)
})
