import { expect, jest, test } from '@jest/globals'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'

jest.unstable_mockModule('../src/parts/RpcRegistry/RpcRegistry.ts', () => {
  return {
    get: jest.fn(),
  }
})

const Rpc = await import('../src/parts/Rpc/Rpc.ts')
const RpcRegistry = await import('../src/parts/RpcRegistry/RpcRegistry.ts')

test('invoke - calls rpc invoke method with correct arguments', async () => {
  const mockRpc = {
    // @ts-ignore
    invoke: jest.fn().mockResolvedValue('test result'),
  }
  // @ts-ignore
  RpcRegistry.get.mockReturnValue(mockRpc)

  const result = await Rpc.invoke('test.method', 'arg1', 'arg2')
  expect(result).toBe('test result')
  expect(RpcRegistry.get).toHaveBeenCalledWith(RpcId.RendererWorker)
  expect(mockRpc.invoke).toHaveBeenCalledWith('test.method', 'arg1', 'arg2')
})

test('send - calls rpc send method with correct arguments', () => {
  const mockRpc = {
    send: jest.fn(),
  }
  // @ts-ignore
  RpcRegistry.get.mockReturnValue(mockRpc)

  Rpc.send('test.method', 'arg1', 'arg2')
  expect(RpcRegistry.get).toHaveBeenCalledWith(RpcId.RendererWorker)
  expect(mockRpc.send).toHaveBeenCalledWith('test.method', 'arg1', 'arg2')
})

test('invokeAndTransfer - calls rpc invokeAndTransfer method with correct arguments', async () => {
  const mockRpc = {
    // @ts-ignore
    invokeAndTransfer: jest.fn().mockResolvedValue('test result'),
  }
  // @ts-ignore
  RpcRegistry.get.mockReturnValue(mockRpc)

  const result = await Rpc.invokeAndTransfer('test.method', 'arg1', 'arg2')
  expect(result).toBe('test result')
  expect(RpcRegistry.get).toHaveBeenCalledWith(RpcId.RendererWorker)
  expect(mockRpc.invokeAndTransfer).toHaveBeenCalledWith('test.method', 'arg1', 'arg2')
})

test.skip('invoke - throws error when rpc is not found', async () => {
  // @ts-ignore
  RpcRegistry.get.mockReturnValue(undefined)

  await expect(Rpc.invoke('test.method')).rejects.toThrow()
})
