import * as ExtensionHostRpcState from '../ExtensionHostRpcState/ExtensionHostRpcState.ts'
import * as GetUrlPrefix from '../GetUrlPrefix/GetUrlPrefix.ts'
import * as Platform from '../Platform/Platform.ts'

export const handleRpcInfos = (extension) => {
  try {
    if (!extension) {
      return
    }
    const rpcs = extension.rpc
    const urlPrefix = GetUrlPrefix.getUrlPrefix(Platform.platform, extension.path)

    if (!rpcs) {
      return
    }
    if (!Array.isArray(rpcs)) {
      return
    }

    for (const rpc of rpcs) {
      rpc.url = `${urlPrefix}/${rpc.url}`
      ExtensionHostRpcState.add(rpc.id, rpc)
    }
  } catch (error) {
    console.warn(`Failed to handle extension rpcs: ${error}`)
  }
}
