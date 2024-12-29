import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.ts'
import * as IpcParentWithNode from '../IpcParentWithNode/IpcParentWithNode.ts'
import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.ts'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.WebSocket:
      return IpcParentWithWebSocket
    case IpcParentType.ElectronMessagePort:
      return IpcParentWithNode
    case IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug:
      return IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug
    default:
      throw new Error('unexpected ipc type')
  }
}
