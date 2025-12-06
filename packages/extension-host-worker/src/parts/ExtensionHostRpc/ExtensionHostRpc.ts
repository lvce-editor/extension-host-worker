import * as Assert from '../Assert/Assert.ts'
import * as CreateLegacyRpc from '../CreateLegacyRpc/CreateLegacyRpc.ts'
import * as GetOrCreateRpcWithId from '../GetOrCreateRpcWithId/GetOrCreateRpcWithId.ts'
import { VError } from '../VError/VError.ts'

export const createRpc = ({ commandMap, contentSecurityPolicy, execute, id, name, url }) => {
  try {
    if (execute && !commandMap) {
      // eslint-disable-next-line no-console
      console.info(`[extension-host-worker] The rpc execute function is deprecated. Use the commandMap property instead.`)
    }
    commandMap ||= {}
    if (id) {
      Assert.string(id)
      return GetOrCreateRpcWithId.createRpcWithId({ commandMap, execute, id })
    }
    return CreateLegacyRpc.createLegacyRpc({ commandMap, contentSecurityPolicy, execute, name, url })
  } catch (error) {
    throw new VError(error, `Failed to create webworker rpc`)
  }
}
