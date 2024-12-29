import * as IpcParentWithElectronMessagePort from '../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.ts'
import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const getModule = () => {
  switch (Platform.platform) {
    case PlatformType.Remote:
      return IpcParentWithWebSocket
    default:
      return IpcParentWithElectronMessagePort
  }
}

export const create = async ({ type, raw }) => {
  const module = getModule()
  const rpc = await module.create({ type })
  return rpc
}
