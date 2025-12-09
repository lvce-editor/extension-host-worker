import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostFormatting from '../src/parts/ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

beforeEach(() => {
  ExtensionHostFormatting.reset()
})

test('executeFormattingProvider - error - result value is of type string', async () => {
  TextDocument.setFiles([
    {
      content: 'a',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    format() {
      return 'b'
    },
    languageId: 'javascript',
  })
  // @ts-ignore
  await expect(ExtensionHostFormatting.executeFormattingProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute formatting provider: invalid formatting result: formatting must be of type array but is "b"'),
  )
})

test('executeFormattingProvider - error - result value is of type object', async () => {
  TextDocument.setFiles([
    {
      content: 'a',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    format() {
      return {}
    },
    languageId: 'javascript',
  })
  // @ts-ignore
  await expect(ExtensionHostFormatting.executeFormattingProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute formatting provider: invalid formatting result: formatting must be of type array but is object'),
  )
})

test('executeFormattingProvider', async () => {
  TextDocument.setFiles([
    {
      content: 'a',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostFormatting.registerFormattingProvider({
    format() {
      return [
        {
          endOffset: 1,
          inserted: 'b',
          startOffset: 0,
        },
      ]
    },
    languageId: 'javascript',
  })
  // @ts-ignore
  expect(await ExtensionHostFormatting.executeFormattingProvider(1, 0)).toEqual([{ endOffset: 1, inserted: 'b', startOffset: 0 }])
})
