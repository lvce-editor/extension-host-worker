import * as Assert from '../Assert/Assert.ts'
import * as DebugRpc from '../DebugWorker/DebugWorker.ts'
import { VError } from '../VError/VError.ts'

const state = {
  debugProviderMap: Object.create(null),
}

const getDebugProvider = (id) => {
  const provider = state.debugProviderMap[id]
  if (!provider) {
    // @ts-ignore
    throw new VError(`no debug provider "${id}" found`)
  }
  return provider
}

export const registerDebugProvider = (debugProvider) => {
  if (!debugProvider.id) {
    throw new Error('Failed to register debug system provider: missing id')
  }
  state.debugProviderMap[debugProvider.id] = debugProvider
}

const handlePaused = async (params) => {
  // @ts-ignore
  await DebugRpc.invoke('Debug.paused', params)
}

const handleResumed = async () => {
  // @ts-ignore
  await DebugRpc.invoke('Debug.resumed')
}

const handleScriptParsed = async (parsedScript) => {
  // @ts-ignore
  await DebugRpc.invoke('Debug.scriptParsed', parsedScript)
}

const handleChange = async () => {
  // @ts-ignore
  await DebugRpc.invoke('Debug.handleChange')
}

export const start = async (protocol, path) => {
  try {
    const provider = getDebugProvider(protocol)
    await provider.start({ handlePaused, handleResumed, handleScriptParsed, handleChange }, path)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const listProcesses = async (protocol, path) => {
  try {
    const provider = getDebugProvider(protocol)
    const processes = await provider.listProcesses(path)
    Assert.array(processes)
    return processes
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const resume = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.resume()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const pause = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.pause()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const getScriptSource = async (protocol, scriptId: string) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.getScriptSource(scriptId)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

// TODO create direct connection from debug worker to extension, not needing extension host worker apis

export const getStatus = async (protocol: string) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.getStatus()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const getCallStack = async (protocol: string) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.getCallStack()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}
export const getScopeChain = async (protocol: string) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.getScopeChain()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const step = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.step()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const stepInto = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.stepInto()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const stepOut = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.stepOut()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const stepOver = async (protocol) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.stepOver()
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const setPauseOnException = async (protocol, value) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.setPauseOnExceptions(value)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const getProperties = async (protocol, objectId) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.getProperties(objectId)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const evaluate = async (protocol, expression, callFrameId) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.evaluate(expression, callFrameId)
  } catch (error) {
    throw new VError(error, 'Failed to execute debug provider')
  }
}

export const setPauseOnExceptions = async (protocol, value) => {
  try {
    const provider = getDebugProvider(protocol)
    return await provider.setPauseOnExceptions(value)
  } catch (error) {
    throw new VError(error, 'Failed to execute setPauseOnExceptions')
  }
}
