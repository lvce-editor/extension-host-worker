const registry = Object.create(null)

export const register = (id, execute) => {
  registry[id] = execute
}

export const acquire = (id) => {
  const fn = registry[id]
  delete registry[id]
  return fn
}
