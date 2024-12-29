import * as Assert from '../Assert/Assert.ts'
import * as CreateLegacyRpc from '../CreateLegacyRpc/CreateLegacyRpc.ts'
import * as GetOrCreateRpcWithId from '../GetOrCreateRpcWithId/GetOrCreateRpcWithId.ts'
import { VError } from '../VError/VError.ts'

export const createRpc = ({ id, url, name, commandMap, contentSecurityPolicy, execute }) => {
  try {
    if (execute && !commandMap) {
      console.info(`[extension-host-worker] The execute function is deprecated. Use the commandMap property instead.`)
    }
    commandMap ||= {}
    if (id) {
      Assert.string(id)
      return GetOrCreateRpcWithId.createRpcWithId({ id, execute, commandMap })
    }
    return CreateLegacyRpc.createLegacyRpc({ url, name, execute, commandMap, contentSecurityPolicy })
  } catch (error) {
    throw new VError(error, `Failed to create webworker rpc`)
  }
}
