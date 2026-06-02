import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import type { OutputChannel } from '../OutputChannelHandle/OutputChannelHandle.ts'
import type { OutputChannelRegistrySnapshot } from '../OutputChannelRegistrySnapshot/OutputChannelRegistrySnapshot.ts'
import type { RegisteredOutputChannel } from '../RegisteredOutputChannel/RegisteredOutputChannel.ts'

const outputChannels: Record<string, RegisteredOutputChannel> = Object.create(null)
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

  constructor(id: string) {
    this.#id = id
  }

  async append(text: string): Promise<void> {
    assertCanWrite(this.#id)
    await ExtensionManagementWorker.invoke('ExtensionApi.appendOutputChannel', this.#id, text)
  }

  async appendLine(text: string): Promise<void> {
    assertCanWrite(this.#id)
    await ExtensionManagementWorker.invoke('ExtensionApi.appendOutputChannel', this.#id, `${text}\n`)
  }

  async clear(): Promise<void> {
    assertCanWrite(this.#id)
    await ExtensionManagementWorker.invoke('ExtensionApi.clearOutputChannel', this.#id)
  }

  async replace(text: string): Promise<void> {
    assertCanWrite(this.#id)
    await ExtensionManagementWorker.invoke('ExtensionApi.replaceOutputChannel', this.#id, text)
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
  return new ExtensionOutputChannel(id)
}

export const getOutputChannelRegistrySnapshot = (): OutputChannelRegistrySnapshot => {
  return {
    outputChannels: Object.values(outputChannels),
  }
}

export const resetOutputChannelRegistry = (): void => {
  for (const id of Object.keys(outputChannels)) {
    delete outputChannels[id]
  }
  isActivated = false
}

export type { OutputChannel } from '../OutputChannelHandle/OutputChannelHandle.ts'
export type { OutputChannelRegistrySnapshot } from '../OutputChannelRegistrySnapshot/OutputChannelRegistrySnapshot.ts'
export type { RegisteredOutputChannel } from '../RegisteredOutputChannel/RegisteredOutputChannel.ts'
