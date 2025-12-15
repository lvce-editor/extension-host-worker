import * as ExtensionModules from '../ExtensionModules/ExtensionModules.ts'

export const activateExtension3 = async (extensionId: string, extension: any): Promise<void> => {
  const module = ExtensionModules.acquire(extensionId)
  if (!module) {
    throw new Error(`extension module ${extensionId} not found`)
  }
  await module.activate(extension)
}
