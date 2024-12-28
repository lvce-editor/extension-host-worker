import { IpcParentWithWebSocket } from '@lvce-editor/ipc'
import * as Assert from '../Assert/Assert.ts'
import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.ts'

export const create = async ({ type }) => {
  Assert.string(type)
  const wsUrl = GetWebSocketUrl.getWebSocketUrl(type)
  const webSocket = new WebSocket(wsUrl)
  return IpcParentWithWebSocket.create({
    webSocket,
  })
}

export const wrap = (webSocket) => {
  return IpcParentWithWebSocket.wrap(webSocket)
}
