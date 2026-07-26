import type { Disposable } from '../Disposable/Disposable.ts'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

export interface DebugEmitter {
  readonly handleChange: (params: unknown) => Promise<void>
  readonly handlePaused: (params: unknown) => Promise<void>
  readonly handleResumed: () => Promise<void>
  readonly handleScriptParsed: (script: unknown) => Promise<void>
}

export interface DebugProvider {
  readonly evaluate: (expression: string, callFrameId: string) => unknown
  readonly getProperties: (objectId: string) => unknown
  readonly id: string
  readonly listProcesses: (path?: string) => unknown
  readonly pause: () => unknown
  readonly resume: () => unknown
  readonly setPauseOnExceptions: (value: number) => unknown
  readonly start: (emitter: DebugEmitter, path?: string) => unknown
  readonly step: () => unknown
  readonly stepInto: () => unknown
  readonly stepOut: () => unknown
  readonly stepOver: () => unknown
}

const providers: Record<string, DebugProvider> = Object.create(null)

const requiredMethods = [
  'evaluate',
  'getProperties',
  'listProcesses',
  'pause',
  'resume',
  'setPauseOnExceptions',
  'start',
  'step',
  'stepInto',
  'stepOut',
  'stepOver',
] as const

const assertDebugProvider = (provider: DebugProvider): void => {
  if (!provider) {
    throw new ExtensionApiError('debug provider is not defined')
  }
  if (typeof provider.id !== 'string' || provider.id.length === 0) {
    throw new ExtensionApiError('debug provider is missing id')
  }
  for (const methodName of requiredMethods) {
    if (typeof provider[methodName] !== 'function') {
      throw new ExtensionApiError(`debug provider ${provider.id} is missing ${methodName} function`)
    }
  }
  if (provider.id in providers) {
    throw new ExtensionApiError(`debug provider ${provider.id} is already registered`)
  }
}

const getProvider = (id: string): DebugProvider => {
  const provider = providers[id]
  if (!provider) {
    throw new ExtensionApiError(`debug provider ${id} not found`)
  }
  return provider
}

const emitter: DebugEmitter = {
  async handleChange(): Promise<void> {},
  async handlePaused(params: unknown): Promise<void> {
    await executeCommand('Debug.paused', params)
  },
  async handleResumed(): Promise<void> {
    await executeCommand('Debug.resumed')
  },
  async handleScriptParsed(script: unknown): Promise<void> {
    await executeCommand('Debug.scriptParsed', script)
  },
}

export const registerDebugProvider = (provider: DebugProvider): Disposable => {
  assertDebugProvider(provider)
  providers[provider.id] = provider
  return {
    dispose(): void {
      delete providers[provider.id]
    },
  }
}

export const executeDebugStart = async (id: string, path?: string): Promise<unknown> => {
  return getProvider(id).start(emitter, path)
}

export const executeDebugListProcesses = async (id: string, path?: string): Promise<unknown> => {
  return getProvider(id).listProcesses(path)
}

export const executeDebugResume = async (id: string): Promise<unknown> => {
  return getProvider(id).resume()
}

export const executeDebugPause = async (id: string): Promise<unknown> => {
  return getProvider(id).pause()
}

export const executeDebugStepOver = async (id: string): Promise<unknown> => {
  return getProvider(id).stepOver()
}

export const executeDebugStepInto = async (id: string): Promise<unknown> => {
  return getProvider(id).stepInto()
}

export const executeDebugStepOut = async (id: string): Promise<unknown> => {
  return getProvider(id).stepOut()
}

export const executeDebugStep = async (id: string): Promise<unknown> => {
  return getProvider(id).step()
}

export const executeDebugSetPauseOnExceptions = async (id: string, value: number): Promise<unknown> => {
  return getProvider(id).setPauseOnExceptions(value)
}

export const executeDebugGetProperties = async (id: string, objectId: string): Promise<unknown> => {
  return getProvider(id).getProperties(objectId)
}

export const executeDebugEvaluate = async (id: string, expression: string, callFrameId: string): Promise<unknown> => {
  return getProvider(id).evaluate(expression, callFrameId)
}

export const resetDebugProviderRegistry = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
