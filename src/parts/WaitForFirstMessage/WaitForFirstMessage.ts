export const waitForFirstMessage = async (port: MessagePort): Promise<MessageEvent> => {
  const { resolve, promise } = Promise.withResolvers()
  port.onmessage = resolve
  const firstMessage = await promise
  return firstMessage as MessageEvent
}
