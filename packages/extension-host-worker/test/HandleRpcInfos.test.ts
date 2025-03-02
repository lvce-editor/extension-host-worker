import { expect, jest, test } from '@jest/globals'
import * as ExtensionHostRpcState from '../src/parts/ExtensionHostRpcState/ExtensionHostRpcState.ts'
import * as HandleRpcInfos from '../src/parts/HandleRpcInfos/HandleRpcInfos.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'

test('handleRpcInfos - no extension', () => {
  HandleRpcInfos.handleRpcInfos(undefined, PlatformType.Remote)
  expect(ExtensionHostRpcState.getAll()).toEqual({})
})

test('handleRpcInfos - no rpcs', () => {
  HandleRpcInfos.handleRpcInfos(
    {
      path: '/test',
    },
    PlatformType.Remote,
  )
  expect(ExtensionHostRpcState.getAll()).toEqual({})
})

test('handleRpcInfos - rpcs not array', () => {
  HandleRpcInfos.handleRpcInfos(
    {
      path: '/test',
      rpc: 'not-an-array',
    },
    PlatformType.Remote,
  )
  expect(ExtensionHostRpcState.getAll()).toEqual({})
})

test('handleRpcInfos - with rpcs', () => {
  const extension = {
    path: '/test',
    rpc: [
      {
        id: 'test-id',
        url: 'test-url',
      },
    ],
  }
  HandleRpcInfos.handleRpcInfos(extension, PlatformType.Web)
  expect(ExtensionHostRpcState.getAll()).toEqual({
    'test-id': {
      id: 'test-id',
      url: '/test/test-url',
    },
  })
})

test.skip('handleRpcInfos - error', () => {
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  HandleRpcInfos.handleRpcInfos(
    {
      path: '/test',
      rpc: null,
    },
    PlatformType.Web,
  )
  expect(consoleSpy).toHaveBeenCalledWith("Failed to handle extension rpcs: TypeError: Cannot read properties of null (reading 'length')")
  consoleSpy.mockRestore()
})
