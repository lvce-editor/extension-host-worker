import * as IpcParentWithElectronMessagePort from '../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.ts'
import * as IpcParentWithWebSocket from '../IpcParentWithWebSocket/IpcParentWithWebSocket.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const getModule = (platform: string) => {
  switch (platform) {
    case PlatformType.Remote:
      return IpcParentWithWebSocket
    default:
      return IpcParentWithElectronMessagePort
  }
}

export const create = async ({ type, raw }) => {
  const module = getModule(Platform.platform)
  const rpc = await module.create({ type })
  return rpc
}
