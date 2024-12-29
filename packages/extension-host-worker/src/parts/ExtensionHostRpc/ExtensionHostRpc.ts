import * as Assert from '../Assert/Assert.ts'
import * as CreateLegacyRpc from '../CreateLegacyRpc/CreateLegacyRpc.ts'
import * as GetOrCreateRpcWithId from '../GetOrCreateRpcWithId/GetOrCreateRpcWithId.ts'
import { VError } from '../VError/VError.ts'

const defaultExecute = () => {
  throw new Error('not implemented')
}

export const createRpc = ({ id, url, name, execute = defaultExecute, contentSecurityPolicy }) => {
  try {
    if (id) {
      Assert.string(id)
      return GetOrCreateRpcWithId.createRpcWithId({ id, execute })
    }
    return CreateLegacyRpc.createLegacyRpc({ url, name, execute, contentSecurityPolicy })
  } catch (error) {
    throw new VError(error, `Failed to create webworker rpc`)
  }
}
