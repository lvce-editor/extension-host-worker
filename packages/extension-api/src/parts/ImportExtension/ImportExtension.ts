import * as ExtensionModules from '../ExtensionModules/ExtensionModules.ts'

export const importExtension = async (extensionId: string, absolutePath: string): Promise<void> => {
  const module = await import(absolutePath)
  ExtensionModules.set(extensionId, module)
}
