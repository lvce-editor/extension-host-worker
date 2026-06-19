import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  activateOutputChannels,
  createOutputChannel,
  getOutputChannelRegistrySnapshot,
  resetOutputChannelRegistry,
} from '../../../src/parts/OutputChannel/OutputChannel.ts'

afterEach(() => {
  resetOutputChannelRegistry()
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
  strictEqual(typeof output.getLogs, 'function')
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

test('getLogs rejects before activation', async () => {
  const output = createOutputChannel('sample-output')

  await rejects(() => output.getLogs(), /output channel sample-output cannot be written before activate/)
})

test('append writes text to output channel logs', async () => {
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.append('hello')

  strictEqual(await output.getLogs(), 'hello')
})

test('append allows empty text', async () => {
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.append('')

  strictEqual(await output.getLogs(), '')
})

test('appendLine appends a newline', async () => {
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.appendLine('hello')

  strictEqual(await output.getLogs(), 'hello\n')
})

test('replace sends replacement text', async () => {
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.replace('new content')

  strictEqual(await output.getLogs(), 'new content')
})

test('clear clears the output channel', async () => {
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.append('old content')
  await output.clear()

  strictEqual(await output.getLogs(), '')
})

test('getLogs returns output channel logs', async () => {
  const output = createOutputChannel('sample-output')
  activateOutputChannels()

  await output.appendLine('sample')
  await output.append('logs')
  const logs = await output.getLogs()

  strictEqual(logs, 'sample\nlogs')
})

test('multiple channels invoke with their own ids', async () => {
  const first = createOutputChannel('sample-first')
  const second = createOutputChannel('sample-second')
  activateOutputChannels()

  await first.append('one')
  await second.append('two')

  strictEqual(await first.getLogs(), 'one')
  strictEqual(await second.getLogs(), 'two')
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
