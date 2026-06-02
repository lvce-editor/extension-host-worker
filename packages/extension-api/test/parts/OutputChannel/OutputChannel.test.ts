import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  activateOutputChannels,
  createOutputChannel,
  getOutputChannelRegistrySnapshot,
  resetOutputChannelRegistry,
} from '../../../src/parts/OutputChannel/OutputChannel.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

interface Invocation {
  readonly method: string
  readonly params: readonly unknown[]
}

let mockRpc: MockRpcDisposable | undefined

const registerOutputChannelMock = (): Invocation[] => {
  const invocations: Invocation[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    'ExtensionApi.appendOutputChannel'(id: string, text: string): void {
      invocations.push({
        method: 'ExtensionApi.appendOutputChannel',
        params: [id, text],
      })
    },
    'ExtensionApi.clearOutputChannel'(id: string): void {
      invocations.push({
        method: 'ExtensionApi.clearOutputChannel',
        params: [id],
      })
    },
    'ExtensionApi.replaceOutputChannel'(id: string, text: string): void {
      invocations.push({
        method: 'ExtensionApi.replaceOutputChannel',
        params: [id, text],
      })
    },
  })
  return invocations
}

afterEach(() => {
  resetOutputChannelRegistry()
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('createOutputChannel registers an output channel', () => {
  createOutputChannel('sample-output')

  deepStrictEqual(getOutputChannelRegistrySnapshot(), {
    outputChannels: [
      {
        id: 'sample-output',
      },
    ],
  })
})

test('createOutputChannel returns an output channel with write methods', () => {
  const output = createOutputChannel('sample-output')

  strictEqual(typeof output.append, 'function')
  strictEqual(typeof output.appendLine, 'function')
  strictEqual(typeof output.clear, 'function')
  strictEqual(typeof output.replace, 'function')
})

test('createOutputChannel rejects empty id', () => {
  throws(() => createOutputChannel(''), /output channel id is required/)
})

test('createOutputChannel rejects non-string id', () => {
  throws(() => createOutputChannel(undefined as unknown as string), /output channel id is required/)
})

test('createOutputChannel rejects duplicate id', () => {
  createOutputChannel('sample-output')

  throws(() => createOutputChannel('sample-output'), /output channel sample-output is already created/)
})

test('createOutputChannel rejects dotted id', () => {
  throws(() => createOutputChannel('sample.output'), /output channel id sample\.output must be dash-case/)
})

test('createOutputChannel rejects camel case id', () => {
  throws(() => createOutputChannel('sampleOutput'), /output channel id sampleOutput must be dash-case/)
})

test('createOutputChannel rejects uppercase id', () => {
  throws(() => createOutputChannel('Sample-Output'), /output channel id Sample-Output must be dash-case/)
})

test('createOutputChannel rejects underscore id', () => {
  throws(() => createOutputChannel('sample_output'), /output channel id sample_output must be dash-case/)
})

test('createOutputChannel rejects leading dash', () => {
  throws(() => createOutputChannel('-sample-output'), /output channel id -sample-output must be dash-case/)
})

test('createOutputChannel rejects trailing dash', () => {
  throws(() => createOutputChannel('sample-output-'), /output channel id sample-output- must be dash-case/)
})

test('createOutputChannel rejects repeated dashes', () => {
  throws(() => createOutputChannel('sample--output'), /output channel id sample--output must be dash-case/)
})

test('append rejects before activation', async () => {
  const output = createOutputChannel('sample-output')

  await rejects(() => output.append('hello'), /output channel sample-output cannot be written before activate/)
})

test('appendLine rejects before activation', async () => {
  const output = createOutputChannel('sample-output')

  await rejects(() => output.appendLine('hello'), /output channel sample-output cannot be written before activate/)
})

test('replace rejects before activation', async () => {
  const output = createOutputChannel('sample-output')

  await rejects(() => output.replace('hello'), /output channel sample-output cannot be written before activate/)
})

test('clear rejects before activation', async () => {
  const output = createOutputChannel('sample-output')

  await rejects(() => output.clear(), /output channel sample-output cannot be written before activate/)
})

test('append writes text to extension management worker', async () => {
  const invocations = registerOutputChannelMock()
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.append('hello')

  deepStrictEqual(invocations, [
    {
      method: 'ExtensionApi.appendOutputChannel',
      params: ['sample-output', 'hello'],
    },
  ])
})

test('append allows empty text', async () => {
  const invocations = registerOutputChannelMock()
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.append('')

  deepStrictEqual(invocations, [
    {
      method: 'ExtensionApi.appendOutputChannel',
      params: ['sample-output', ''],
    },
  ])
})

test('appendLine appends a newline', async () => {
  const invocations = registerOutputChannelMock()
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.appendLine('hello')

  deepStrictEqual(invocations, [
    {
      method: 'ExtensionApi.appendOutputChannel',
      params: ['sample-output', 'hello\n'],
    },
  ])
})

test('replace sends replacement text', async () => {
  const invocations = registerOutputChannelMock()
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.replace('new content')

  deepStrictEqual(invocations, [
    {
      method: 'ExtensionApi.replaceOutputChannel',
      params: ['sample-output', 'new content'],
    },
  ])
})

test('clear clears the output channel', async () => {
  const invocations = registerOutputChannelMock()
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.clear()

  deepStrictEqual(invocations, [
    {
      method: 'ExtensionApi.clearOutputChannel',
      params: ['sample-output'],
    },
  ])
})

test('multiple channels invoke with their own ids', async () => {
  const invocations = registerOutputChannelMock()
  const first = createOutputChannel('sample-first')
  const second = createOutputChannel('sample-second')
  activateOutputChannels()

  await first.append('one')
  await second.append('two')

  deepStrictEqual(invocations, [
    {
      method: 'ExtensionApi.appendOutputChannel',
      params: ['sample-first', 'one'],
    },
    {
      method: 'ExtensionApi.appendOutputChannel',
      params: ['sample-second', 'two'],
    },
  ])
})

test('resetOutputChannelRegistry clears registered output channels', () => {
  createOutputChannel('sample-output')

  resetOutputChannelRegistry()

  deepStrictEqual(getOutputChannelRegistrySnapshot(), {
    outputChannels: [],
  })
})

test('resetOutputChannelRegistry marks existing channels inactive', async () => {
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  resetOutputChannelRegistry()

  await rejects(() => output.append('hello'), /output channel sample-output cannot be written before activate/)
})
