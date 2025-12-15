import * as Assert from '../Assert/Assert.ts'
import * as ExtensionModules from '../ExtensionModules/ExtensionModules.ts'
import * as ImportScript from '../ImportScript/ImportScript.ts'

export const importExtension2 = async (extensionId: string, absolutePath: string) => {
  Assert.string(absolutePath)
  const module = await ImportScript.importScript(absolutePath)
  ExtensionModules.set(extensionId, module)
}
