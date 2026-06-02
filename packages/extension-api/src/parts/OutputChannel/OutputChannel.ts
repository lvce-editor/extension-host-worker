import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

export interface OutputChannelRegistrySnapshot {
  readonly outputChannels: readonly RegisteredOutputChannel[]
}

export interface RegisteredOutputChannel {
  readonly id: string
}

export interface OutputChannel {
  append(text: string): Promise<void>
  appendLine(text: string): Promise<void>
  clear(): Promise<void>
  replace(text: string): Promise<void>
}

const outputChannels: Record<string, RegisteredOutputChannel> = Object.create(null)
let isActivated = false

const assertOutputChannelId = (id: string): void => {
  if (typeof id !== 'string' || id.length === 0) {
    throw new ExtensionApiError('output channel id is required')
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
