import { expect, jest, test } from '@jest/globals'
import { getText } from '../src/parts/GetText/GetText.ts'
import { VError } from '@lvce-editor/verror'

test('getText fetches text from URL', async () => {
  const mockUrl = 'https://example.com/text'
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      statusText: 'OK',
      text: () => Promise.resolve('Mocked text content'),
    }),
  )
  const result = await getText(mockUrl)
  expect(result).toBe('Mocked text content')
  expect(fetch).toHaveBeenCalledWith(mockUrl)
})

test('getText throws error on fetch failure', async () => {
  const mockUrl = 'https://example.com/text'

  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      statusText: 'Not Found',
    }),
  )
  await expect(getText(mockUrl)).rejects.toThrow(VError)
  await expect(getText(mockUrl)).rejects.toThrow('Failed to get text')
})
