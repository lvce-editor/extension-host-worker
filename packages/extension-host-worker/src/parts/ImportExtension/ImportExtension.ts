import * as Assert from '../Assert/Assert.ts'
import * as ExtensionModules from '../ExtensionModules/ExtensionModules.ts'
import * as ImportScript from '../ImportScript/ImportScript.ts'
import * as IsImportError from '../IsImportError/IsImportError.ts'
import * as RuntimeStatusState from '../RuntimeStatusState/RuntimeStatusState.ts'
import * as RuntimeStatusType from '../RuntimeStatusType/RuntimeStatusType.ts'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.ts'
import { VError } from '../VError/VError.ts'

export const importExtension = async (extensionId: string, absolutePath: string, activationEvent: string) => {
  try {
    Assert.string(absolutePath)
    const startTime = performance.now()
    RuntimeStatusState.set({
      activationEvent: activationEvent,
      id: extensionId,
      activationStartTime: performance.now(),
      status: RuntimeStatusType.Importing,
      activationEndTime: 0,
      activationTime: 0,
      importStartTime: startTime,
      importEndTime: 0,
      importTime: 0,
    })
    try {
      const module = await ImportScript.importScript(absolutePath)
      const endTime = performance.now()
      const time = endTime - startTime
      ExtensionModules.set(extensionId, module)
      RuntimeStatusState.update(extensionId, {
        importEndTime: endTime,
        importTime: time,
      })
    } catch (error) {
      RuntimeStatusState.update(extensionId, {
        status: RuntimeStatusType.Error, // TODO maybe store error also in runtime status state
      })
      if (IsImportError.isImportError(error)) {
        const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(absolutePath, error)
        throw new Error(actualErrorMessage)
      }
      throw error
    }
  } catch (error) {
    throw new VError(error, `Failed to import extension ${extensionId}`)
  }
}
