import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostRename from '../src/parts/ExtensionHostRename/ExtensionHostRename.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

beforeEach(() => {
  ExtensionHostRename.reset()
})

test('executeRenameProvider - no results', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostRename.registerRenameProvider({
    languageId: 'javascript',
    async prepareRename() {
      return undefined
    },
  })
  // @ts-ignore
  expect(await ExtensionHostRename.executeprepareRenameProvider(1, 0)).toBe(undefined)
})

test('executeRename - error - rename provider throws error', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostRename.registerRenameProvider({
    languageId: 'javascript',
    provideRename() {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostRename.executeRenameProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute rename provider: TypeError: x is not a function'),
  )
})

test('executeRename - error - edit is missing uri', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostRename.registerRenameProvider({
    languageId: 'javascript',
    provideRename() {
      return {
        canRename: true,
        edits: [
          {
            edits: [{}],
            uri: null,
          },
        ],
      }
    },
  })
  // @ts-ignore
  await expect(ExtensionHostRename.executeRenameProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute rename provider: invalid rename result: renameResult item uri must be of type string'),
  )
})
