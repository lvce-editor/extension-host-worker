import { test, expect, jest } from '@jest/globals'
import { getJson } from '../src/parts/GetJson/GetJson.ts'
import { VError } from '@lvce-editor/verror'

test('getJson - should fetch and parse json successfully', async () => {
  const mockData = { test: 'data' }
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockData),
  })

  const result = await getJson('https://example.com/data.json')
  expect(result).toEqual({ test: 'data' })
})

test('getJson - should throw error when response is not ok', async () => {
  // @ts-ignore
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    statusText: 'Not Found',
  })

  await expect(getJson('https://example.com/data.json')).rejects.toThrow(VError)
})

test('getJson - should wrap fetch errors in VError', async () => {
  // @ts-ignore
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

  await expect(getJson('https://example.com/data.json')).rejects.toThrow(VError)
})
