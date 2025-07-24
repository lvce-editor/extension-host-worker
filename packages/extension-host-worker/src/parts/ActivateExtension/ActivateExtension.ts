import * as Assert from '../Assert/Assert.ts'
import * as CancelToken from '../CancelToken/CancelToken.ts'
import * as GetExtensionId from '../GetExtensionId/GetExtensionId.ts'
import * as HandleRpcInfos from '../HandleRpcInfos/HandleRpcInfos.ts'
import * as ImportScript from '../ImportScript/ImportScript.ts'
import * as IsImportError from '../IsImportError/IsImportError.ts'
import * as Platform from '../Platform/Platform.ts'
import * as RuntimeStatusState from '../RuntimeStatusState/RuntimeStatusState.ts'
import * as RuntimeStatusType from '../RuntimeStatusType/RuntimeStatusType.ts'
import * as Timeout from '../Timeout/Timeout.ts'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.ts'
import { VError } from '../VError/VError.ts'

const activationTimeout = 10_000

const rejectAfterTimeout = async (timeout, token) => {
  await Timeout.sleep(timeout)
  if (CancelToken.isCanceled(token)) {
    return
  }
  throw new Error(`Activation timeout of ${timeout}ms exceeded`)
}

// TODO separate importing extension and activating extension for smaller functions
// and better error handling
export const activateExtension = async (extension: any, absolutePath: string, activationEvent: string) => {
  const extensionId = extension.id
  try {
    Assert.string(extension.path)
    Assert.string(extension.browser)
    Assert.string(absolutePath)
    const startTime = performance.now()
    RuntimeStatusState.set({
      activationEndTime: 0,
      activationEvent: activationEvent,
      activationStartTime: startTime,
      activationTime: 0,
      id: extensionId,
      status: RuntimeStatusType.Importing,
    })
    const module = await ImportScript.importScript(absolutePath)
    HandleRpcInfos.handleRpcInfos(extension, Platform.platform)
    RuntimeStatusState.update(extensionId, {
      status: RuntimeStatusType.Activating,
    })
    const token = CancelToken.create()
    try {
      await Promise.race([module.activate(extension), rejectAfterTimeout(activationTimeout, token)])
      const endTime = performance.now()
      const time = endTime - startTime
      RuntimeStatusState.update(extensionId, {
        status: RuntimeStatusType.Activated,
        activationStartTime: time,
      })
    } catch (error) {
      if (IsImportError.isImportError(error)) {
        const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(absolutePath, error)
        throw new Error(actualErrorMessage)
      }
      throw error
    } finally {
      CancelToken.cancel(token)
    }
  } catch (error) {
    RuntimeStatusState.update(extensionId, {
      status: RuntimeStatusType.Error, // TODO maybe store error also in runtime status state
    })
    const id = GetExtensionId.getExtensionId(extension)
    throw new VError(error, `Failed to activate extension ${id}`)
  }
  // console.info('activated', path)
}
