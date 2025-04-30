import * as RpcRegistry from '@lvce-editor/rpc-registry'
import * as RpcId from '../RpcId/RpcId.ts'

// TODO use invoke
export const send = async (method: string, ...params: readonly any[]): Promise<void> => {
  const rpc = RpcRegistry.get(RpcId.DebugWorker)
  rpc.send(method, ...params)
}
