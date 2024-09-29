import * as Assert from '../Assert/Assert.ts'
import * as Callback from '../Callback/Callback.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

const preparePrettyError = (error) => {
  return error
}

const logError = (error) => {
  // handled by renderer worker
}

const requiresSocket = () => {
  return false
}

export const create = ({ ipc, execute }) => {
  Assert.object(ipc)
  Assert.fn(execute)
  const handleMessage = async (message) => {
    return JsonRpc.handleJsonRpcMessage(ipc, message, execute, Callback.resolve, preparePrettyError, logError, requiresSocket)
  }
  ipc.onmessage = handleMessage
  return {
    ipc,
    invoke(method, ...params) {
      return JsonRpc.invoke(this.ipc, method, ...params)
    },
  }
}
