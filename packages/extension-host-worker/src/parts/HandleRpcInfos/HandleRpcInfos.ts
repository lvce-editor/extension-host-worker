import * as ExtensionHostRpcState from '../ExtensionHostRpcState/ExtensionHostRpcState.ts'
import * as GetUrlPrefix from '../GetUrlPrefix/GetUrlPrefix.ts'

export const handleRpcInfos = (extension) => {
  try {
    if (!extension) {
      return
    }
    const rpcs = extension.rpc
    const urlPrefix = GetUrlPrefix.getUrlPrefix(extension.path)

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
