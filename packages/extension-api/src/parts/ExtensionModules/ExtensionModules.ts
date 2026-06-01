const modules: Record<string, any> = Object.create(null)

export const set = (extensionId: string, module: any): void => {
  modules[extensionId] = module
}

export const acquire = (extensionId: string): any => {
  const module = modules[extensionId]
  delete modules[extensionId]
  return module
}
