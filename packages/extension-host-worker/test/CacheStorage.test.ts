import { beforeEach, expect, jest, test } from '@jest/globals'
import { VError } from '@lvce-editor/verror'
import * as CacheStorage from '../src/parts/CacheStorage/CacheStorage.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

test('getJson - returns cached data', async () => {
  const mockData = { test: 'data' }
  const mockResponse = Response.json(mockData)

  // @ts-ignore
  globalThis.caches = {
    // @ts-ignore
    match: jest.fn().mockResolvedValue(mockResponse),
  }

  const result = await CacheStorage.getJson('test-key')
  expect(result).toEqual(mockData)
  expect(globalThis.caches.match).toHaveBeenCalledWith('test-key', {
    cacheName: 'Extensions',
  })
})

test('getJson - returns undefined when no cache match', async () => {
  // @ts-ignore
  globalThis.caches = {
    // @ts-ignore
    match: jest.fn().mockResolvedValue(undefined),
  }

  const result = await CacheStorage.getJson('test-key')
  expect(result).toBeUndefined()
})

test('setJson - successfully caches data', async () => {
  const mockCache = {
    // @ts-ignore
    put: jest.fn().mockResolvedValue(undefined),
  }

  // @ts-ignore
  globalThis.caches = {
    // @ts-ignore
    open: jest.fn().mockResolvedValue(mockCache),
  }

  await CacheStorage.setJson('test-key', { test: 'data' })

  expect(globalThis.caches.open).toHaveBeenCalledWith('Extensions')
  expect(mockCache.put).toHaveBeenCalledTimes(1)
  expect(mockCache.put.mock.calls[0][0]).toBe('test-key')
  // Verify the Response object in the second argument
  const response = mockCache.put.mock.calls[0][1]
  expect(response).toBeInstanceOf(Response)
  // @ts-ignore
  expect(response.headers.get('Content-Type')).toBe('application/json')
})

test('setJson - throws VError when caching fails', async () => {
  // @ts-ignore
  globalThis.caches = {
    // @ts-ignore
    open: jest.fn().mockRejectedValue(new Error('Cache error')),
  }

  await expect(CacheStorage.setJson('test-key', { test: 'data' })).rejects.toThrow(VError)
  await expect(CacheStorage.setJson('test-key', { test: 'data' })).rejects.toThrow('Failed to add to cache')
})
