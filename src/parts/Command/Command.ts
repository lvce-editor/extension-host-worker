import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.ts'

const state = {}

export const register = (commandMap) => {
  Object.assign(state, commandMap)
}

export const execute = (method, ...params) => {
  // @ts-ignore
  const fn = state[method]
  // @ts-ignore
  if (!fn) {
    throw new CommandNotFoundError(method)
  }
  // @ts-ignore
  return fn(...params)
}
