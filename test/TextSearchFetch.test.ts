import { expect, jest, test } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'

jest.unstable_mockModule('../src/parts/GetJson/GetJson.ts', () => {
  return {
    getJson: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/GetText/GetText.ts', () => {
  return {
    getText: jest.fn(),
  }
})

const TextSearchFetch = await import('../src/parts/TextSearchFetch/TextSearchFetch.ts')
const GetJson = await import('../src/parts/GetJson/GetJson.ts')
const GetText = await import('../src/parts/GetText/GetText.ts')

test('textSearch - finds matches in files', async () => {
  const scheme = 'fetch'
  const root = 'fetch:///test'
  const query = 'test'
  const options = {}
  const assetDir = '/assets'

  // @ts-ignore
  GetJson.getJson.mockResolvedValue(['/test/file-1.txt', '/test/file-2.txt'])

  // @ts-ignore
  GetText.getText.mockImplementation((path) => {
    if (path === '/assets/test/file-1.txt') {
      return Promise.resolve('first test file')
    }
    return Promise.resolve('second file')
  })

  const results = await TextSearchFetch.textSearch(scheme, root, query, options, assetDir)

  expect(results).toEqual([
    {
      type: TextSearchResultType.File,
      text: 'file-1.txt',
      start: 0,
      end: 0,
      lineNumber: 0,
    },
    {
      type: TextSearchResultType.Match,
      text: 'first test file',
      start: 6,
      end: 10,
      lineNumber: 0,
    },
  ])

  // @ts-ignore
  expect(GetJson.getJson).toHaveBeenCalledWith('/assets/config/fileMap.json')
  // @ts-ignore
  expect(GetText.getText).toHaveBeenCalledWith('/assets/test/file-1.txt')
  // @ts-ignore
  expect(GetText.getText).toHaveBeenCalledWith('/assets/test/file-2.txt')
})

test('textSearch - no matches found', async () => {
  const scheme = 'fetch'
  const root = 'fetch:///test'
  const query = 'nonexistent'
  const options = {}
  const assetDir = '/assets'

  // @ts-ignore
  GetJson.getJson.mockResolvedValue(['/test/file.txt'])
  // @ts-ignore
  GetText.getText.mockResolvedValue('content without match')

  const results = await TextSearchFetch.textSearch(scheme, root, query, options, assetDir)

  expect(results).toEqual([])
})

test('textSearch - empty file list', async () => {
  const scheme = 'fetch'
  const root = 'fetch:///test'
  const query = 'test'
  const options = {}
  const assetDir = '/assets'

  // @ts-ignore
  GetJson.getJson.mockResolvedValue([])

  const results = await TextSearchFetch.textSearch(scheme, root, query, options, assetDir)

  expect(results).toEqual([])
})
