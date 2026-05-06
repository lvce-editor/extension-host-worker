import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ExtensionHostSourceControl from '../src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.ts'

beforeEach(() => {
  ExtensionHostSourceControl.reset()
})

test('getChangedFiles', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    getChangedFiles() {
      return [{ file: '/test/file-1.txt', status: 1 }]
    },
    id: 'test',
  })
  expect(await ExtensionHostSourceControl.getChangedFiles('test')).toEqual([
    {
      file: '/test/file-1.txt',
      status: 1,
    },
  ])
})

test('getChangedFiles - error - no provider id specified', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    getChangedFiles() {
      return [{ file: '/test/file-1.txt', status: 1 }]
    },
    id: 'test',
  })
  // @ts-expect-error
  await expect(ExtensionHostSourceControl.getChangedFiles()).rejects.toThrow(new Error('no source control provider found'))
})

test('getEnabledProviderIds', async () => {
  const provider1 = {
    id: 'test-source-control-provider-1',
    isActive: jest.fn(() => {
      return false
    }),
  }
  const provider2 = {
    id: 'test-source-control-provider-2',
    isActive: jest.fn(() => {
      return true
    }),
  }
  ExtensionHostSourceControl.state.providers = {
    [provider1.id]: provider1,
    [provider2.id]: provider2,
  }
  expect(await ExtensionHostSourceControl.getEnabledProviderIds('', '/test/folder')).toEqual(['test-source-control-provider-2'])
  expect(provider1.isActive).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(provider1.isActive).toHaveBeenCalledWith('', '/test/folder')
  expect(provider2.isActive).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(provider2.isActive).toHaveBeenCalledWith('', '/test/folder')
})

test('generateCommitMessage', async () => {
  const generateCommitMessage = jest.fn(() => {
    return 'feat: generated message'
  })
  ExtensionHostSourceControl.registerSourceControlProvider({
    generateCommitMessage,
    id: 'test',
  })

  expect(await ExtensionHostSourceControl.generateCommitMessage('test')).toBe('feat: generated message')
  expect(generateCommitMessage).toHaveBeenCalledTimes(1)
})

test('generateCommitMessage - error - provider missing function', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    id: 'test',
  })

  await expect(ExtensionHostSourceControl.generateCommitMessage('test')).rejects.toThrow(
    new TypeError('source control provider is missing required function generateCommitMessage'),
  )
})

test('getFeatures - from getFeatures function', async () => {
  const getFeatures = jest.fn(() => {
    return {
      showGenerateCommitMessageButton: false,
    }
  })
  ExtensionHostSourceControl.registerSourceControlProvider({
    getFeatures,
    id: 'test',
  })

  expect(await ExtensionHostSourceControl.getFeatures('test')).toEqual({
    showGenerateCommitMessageButton: false,
  })
  expect(getFeatures).toHaveBeenCalledTimes(1)
})

test('getFeatures - from provider property', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    id: 'test',
    showGenerateCommitMessageButton: false,
  })

  expect(await ExtensionHostSourceControl.getFeatures('test')).toEqual({
    showGenerateCommitMessageButton: false,
  })
})

test('getFeatures - defaults to empty object', async () => {
  ExtensionHostSourceControl.registerSourceControlProvider({
    id: 'test',
  })

  expect(await ExtensionHostSourceControl.getFeatures('test')).toEqual({})
})
