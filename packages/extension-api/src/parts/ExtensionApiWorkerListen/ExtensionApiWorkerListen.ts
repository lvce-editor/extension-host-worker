interface InitializeMessage {
  readonly id: number
  readonly method: string
  readonly params: readonly unknown[]
}

const isInitializeMessage = (message: unknown): message is InitializeMessage => {
  return Boolean(message && typeof message === 'object' && 'method' in message && 'params' in message)
}

export const listen = async (): Promise<MessagePort> => {
  const scope = self
  const portPromise = new Promise<MessagePort>((resolve, reject) => {
    scope.addEventListener(
      'message',
      (event) => {
        const message = event.data
        if (!isInitializeMessage(message) || message.method !== 'initialize' || message.params[0] !== 'message-port') {
          reject(new Error('unexpected initial worker message'))
          return
        }
        scope.postMessage({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        resolve(message.params[1] as MessagePort)
      },
      {
        once: true,
      },
    )
  })
  scope.postMessage('ready')
  return portPromise
}
