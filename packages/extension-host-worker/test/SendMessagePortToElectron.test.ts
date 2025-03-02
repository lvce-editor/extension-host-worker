import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
    invokeAndTransfer: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SendMessagePortToElectron = await import('../src/parts/SendMessagePortToElectron/SendMessagePortToElectron.ts')
const Rpc = await import('../src/parts/Rpc/Rpc.ts')

test('sendMessagePortToElectron', async () => {
  // @ts-ignore
  Rpc.invokeAndTransfer.mockImplementation(() => {})
  const port = new MessageChannel().port1
  await SendMessagePortToElectron.sendMessagePortToElectron(port, 'test-command')
  expect(Rpc.invokeAndTransfer).toHaveBeenCalledTimes(1)
  expect(Rpc.invokeAndTransfer).toHaveBeenCalledWith('SendMessagePortToElectron.sendMessagePortToElectron', port, 'test-command')
})
