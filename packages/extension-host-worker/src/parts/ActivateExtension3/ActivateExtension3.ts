import * as ExtensionModules from '../ExtensionModules/ExtensionModules.ts'

export const activateExtension3 = async (extensionId: string, extension: any): Promise<void> => {
  const module = ExtensionModules.acquire(extensionId)
  await module.activate(extension)
}
