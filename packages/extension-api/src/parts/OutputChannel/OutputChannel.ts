import type { OutputChannel } from '../OutputChannelHandle/OutputChannelHandle.ts'
import type { OutputChannelRegistrySnapshot } from '../OutputChannelRegistrySnapshot/OutputChannelRegistrySnapshot.ts'
import type { RegisteredOutputChannel } from '../RegisteredOutputChannel/RegisteredOutputChannel.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import * as OutputChannelStorage from '../OutputChannelStorage/OutputChannelStorage.ts'

const outputChannels: Record<string, RegisteredOutputChannel> = Object.create(null)
const outputChannelHandles: Record<string, ExtensionOutputChannel> = Object.create(null)
let isActivated = false
const RE_DASH_CASE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/

const assertOutputChannelId = (id: string): void => {
  if (typeof id !== 'string' || id.length === 0) {
    throw new ExtensionApiError('output channel id is required')
  }
  if (!RE_DASH_CASE.test(id)) {
    throw new ExtensionApiError(`output channel id ${id} must be dash-case`)
  }
}

const assertCanWrite = (id: string): void => {
  if (!isActivated) {
    throw new ExtensionApiError(`output channel ${id} cannot be written before activate`)
  }
}

class ExtensionOutputChannel implements OutputChannel {
  readonly #id: string
  #pendingWrite: Promise<void>

  constructor(id: string, pendingWrite: Promise<void>) {
    this.#id = id
    this.#pendingWrite = pendingWrite
  }

  #queueWrite(write: () => Promise<void>): Promise<void> {
    this.#pendingWrite = this.#pendingWrite.then(write)
    return this.#pendingWrite
  }

  async append(text: string): Promise<void> {
    assertCanWrite(this.#id)
    await this.#queueWrite(() => OutputChannelStorage.append(this.#id, text))
  }

  async appendLine(text: string): Promise<void> {
    assertCanWrite(this.#id)
    await this.#queueWrite(() => OutputChannelStorage.append(this.#id, `${text}\n`))
  }

  async clear(): Promise<void> {
    assertCanWrite(this.#id)
    await this.#queueWrite(() => OutputChannelStorage.clear(this.#id))
  }

  async getLogs(): Promise<string> {
    assertCanWrite(this.#id)
    await this.#pendingWrite
    return OutputChannelStorage.getLogs(this.#id)
  }

  async replace(text: string): Promise<void> {
    assertCanWrite(this.#id)
    await this.#queueWrite(() => OutputChannelStorage.replace(this.#id, text))
  }
}

export const activateOutputChannels = (): void => {
  isActivated = true
}

export const createOutputChannel = (id: string): OutputChannel => {
  assertOutputChannelId(id)
  if (id in outputChannels) {
    throw new ExtensionApiError(`output channel ${id} is already created`)
  }
  outputChannels[id] = {
    id,
  }
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  const handle = new ExtensionOutputChannel(id, OutputChannelStorage.clear(id))
  outputChannelHandles[id] = handle
  return handle
}

export const getOutputChannelRegistrySnapshot = (): OutputChannelRegistrySnapshot => {
  return {
    outputChannels: Object.values(outputChannels),
  }
}

export const getOutputChannelLogs = async (id: string): Promise<string | undefined> => {
  return outputChannelHandles[id]?.getLogs()
}

export const clearOutputChannel = async (id: string): Promise<boolean> => {
  const handle = outputChannelHandles[id]
  if (!handle) {
    return false
  }
  await handle.clear()
  return true
}

const commandMap = {
  'ExtensionApi.clearOutputChannel': clearOutputChannel,
  'ExtensionApi.getOutputChannelLogs': getOutputChannelLogs,
  'ExtensionApi.getOutputChannelRegistrySnapshot': getOutputChannelRegistrySnapshot,
}

export const resetOutputChannelRegistry = (): void => {
  for (const id of Object.keys(outputChannels)) {
    delete outputChannels[id]
  }
  for (const id of Object.keys(outputChannelHandles)) {
    delete outputChannelHandles[id]
  }
  isActivated = false
}

export type { OutputChannel } from '../OutputChannelHandle/OutputChannelHandle.ts'
export type { OutputChannelRegistrySnapshot } from '../OutputChannelRegistrySnapshot/OutputChannelRegistrySnapshot.ts'
export type { RegisteredOutputChannel } from '../RegisteredOutputChannel/RegisteredOutputChannel.ts'
