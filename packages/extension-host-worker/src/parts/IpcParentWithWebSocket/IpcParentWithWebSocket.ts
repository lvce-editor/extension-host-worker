import { type Rpc, WebSocketRpcParent } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.ts'

export const create = async ({ type }): Promise<Rpc> => {
  Assert.string(type)
  const wsUrl = GetWebSocketUrl.getWebSocketUrl(type, location.host)
  const webSocket = new WebSocket(wsUrl)
  const rpc = await WebSocketRpcParent.create({
    webSocket,
    commandMap: {},
  })
  return rpc
}
