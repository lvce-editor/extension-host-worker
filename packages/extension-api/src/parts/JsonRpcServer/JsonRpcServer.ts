type Command = (...args: readonly any[]) => unknown

interface JsonRpcRequest {
  readonly id?: number
  readonly jsonrpc?: string
  readonly method?: string
  readonly params?: readonly unknown[]
}

interface JsonRpcServerOptions {
  readonly commandMap: Record<string, Command>
  readonly messagePort: MessagePort
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return `${error}`
}

const sendResponse = (messagePort: MessagePort, id: number | undefined, result: unknown): void => {
  if (id === undefined) {
    return
  }
  messagePort.postMessage({
    id,
    jsonrpc: '2.0',
    result,
  })
}

const sendError = (messagePort: MessagePort, id: number | undefined, error: unknown): void => {
  if (id === undefined) {
    return
  }
  messagePort.postMessage({
    error: {
      code: -32000,
      message: getErrorMessage(error),
    },
    id,
    jsonrpc: '2.0',
  })
}

const handleMessage = async (commandMap: Record<string, Command>, messagePort: MessagePort, message: JsonRpcRequest): Promise<void> => {
  if (!message || typeof message.method !== 'string') {
    return
  }
  if (message.method === 'Exit.exit') {
    messagePort.close()
    return
  }
  const command = commandMap[message.method]
  if (!command) {
    sendError(messagePort, message.id, new Error(`command not found: ${message.method}`))
    return
  }
  try {
    const result = await command(...(message.params || []))
    sendResponse(messagePort, message.id, result)
  } catch (error) {
    sendError(messagePort, message.id, error)
  }
}

export const createJsonRpcServer = ({ commandMap, messagePort }: JsonRpcServerOptions): void => {
  messagePort.addEventListener('message', (event) => {
    void handleMessage(commandMap, messagePort, event.data)
  })
  messagePort.start()
}
