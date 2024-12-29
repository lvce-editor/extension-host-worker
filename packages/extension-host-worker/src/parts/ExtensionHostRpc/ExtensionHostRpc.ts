import * as Assert from '../Assert/Assert.ts'
import * as CreateLegacyRpc from '../CreateLegacyRpc/CreateLegacyRpc.ts'
import * as GetOrCreateRpcWithId from '../GetOrCreateRpcWithId/GetOrCreateRpcWithId.ts'
import { VError } from '../VError/VError.ts'

export const createRpc = ({ id, url, name, commandMap = {}, contentSecurityPolicy }) => {
  try {
    if (id) {
      Assert.string(id)
      return GetOrCreateRpcWithId.createRpcWithId({ id, commandMap })
    }
    return CreateLegacyRpc.createLegacyRpc({ url, name, commandMap, contentSecurityPolicy })
  } catch (error) {
    throw new VError(error, `Failed to create webworker rpc`)
  }
}
