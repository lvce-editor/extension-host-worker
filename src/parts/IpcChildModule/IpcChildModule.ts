import { IpcChildWithModuleWorker, IpcChildWithModuleWorkerAndMessagePort, IpcChildWithMessagePort } from '@lvce-editor/ipc'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const getModule = (method: any) => {
  switch (method) {
    case IpcChildType.ModuleWorker:
      return IpcChildWithModuleWorker
    case IpcChildType.ModuleWorkerWithMessagePort:
      return IpcChildWithModuleWorkerAndMessagePort
    case IpcChildType.MessagePort:
      return IpcChildWithMessagePort
    default:
      throw new Error('unexpected ipc type')
  }
}
