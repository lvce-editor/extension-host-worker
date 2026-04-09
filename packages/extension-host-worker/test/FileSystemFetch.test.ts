import { expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

jest.unstable_mockModule('../src/parts/GetJson/GetJson.ts', () => {
  return {
    getJson: jest.fn(),
  }
})

const FileSystemFetch = await import('../src/parts/FileSystemFetch/FileSystemFetch.ts')
const GetJson = await import('../src/parts/GetJson/GetJson.ts')

test('readDirWithFileTypes - ignores sibling directories with same prefix', async () => {
  // @ts-ignore
  GetJson.getJson.mockResolvedValue([
    '/playground/packages/renderer-worker/src/parts/About/About.ipc.js',
    '/playground/packages/renderer-worker/src/parts/About/About.js',
    '/playground/packages/renderer-worker/src/parts/AboutElectron/AboutElectron.js',
    '/playground/packages/renderer-worker/src/parts/AboutViewWorker/AboutViewWorker.js',
  ])

  const result = await FileSystemFetch.readDirWithFileTypes('fetch:///playground/packages/renderer-worker/src/parts/About')

  expect(result).toEqual([
    {
      name: 'About.ipc.js',
      type: DirentType.File,
    },
    {
      name: 'About.js',
      type: DirentType.File,
    },
  ])
})