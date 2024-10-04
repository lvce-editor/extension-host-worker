const registry = Object.create(null)
const rpcs = Object.create(null)

export const register = (id, execute) => {
  registry[id] = execute
}

export const acquire = (id) => {
  const fn = registry[id]
  delete registry[id]
  return fn
}

export const get = (id: string) => {
  return rpcs[id]
}

export const set = (id: string, rpc: any) => {
  rpcs[id] = rpc
}
