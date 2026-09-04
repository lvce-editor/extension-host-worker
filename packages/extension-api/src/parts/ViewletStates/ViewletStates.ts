import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const states: Record<number, unknown> = Object.create(null)

const assertState = (state: unknown): void => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new ExtensionApiError('view state must be an object')
  }
}

export const has = (uid: number): boolean => Object.hasOwn(states, uid)

export const get = <State = unknown>(uid: number): State => {
  if (!has(uid)) {
    throw new ExtensionApiError(`view state ${uid} not found`)
  }
  return states[uid] as State
}

export const replace = (uid: number, newState: unknown): void => {
  if (!has(uid)) {
    throw new ExtensionApiError(`view state ${uid} not found`)
  }
  assertState(newState)
  states[uid] = newState
}

export const set = async (uid: number, newState: unknown): Promise<void> => {
  replace(uid, newState)
  await ExtensionManagementWorker.invoke('Extensions.requestViewRerender', uid)
}

export const initialize = (uid: number, initialState: unknown): void => {
  assertState(initialState)
  states[uid] = initialState
}

export const remove = (uid: number): void => {
  delete states[uid]
}

export const reset = (): void => {
  for (const uid of Object.keys(states)) {
    delete states[Number(uid)]
  }
}
