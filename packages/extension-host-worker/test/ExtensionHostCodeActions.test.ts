import { beforeEach, expect, jest, test } from '@jest/globals'

const executeMock = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()

jest.unstable_mockModule('../src/parts/ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts', () => ({
  execute: executeMock,
  executeOrganizeImports: jest.fn(),
  hasLegacyProvider: (getProvider: (languageId: string) => unknown, textDocumentId: number) => {
    return Boolean(getProvider(TextDocument.get(textDocumentId)?.languageId))
  },
}))

const ExtensionHostCodeActions = await import('../src/parts/ExtensionHostCodeActions/ExtensionHostCodeActions.ts')
const TextDocument = await import('../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts')

beforeEach(() => {
  ExtensionHostCodeActions.reset()
  executeMock.mockReset()
})

test('getSourceActions returns serializable legacy code actions', async () => {
  const provideCodeActions = jest.fn((_textDocument: unknown, _offset: number) => {
    return [
      {
        execute() {},
        kind: 'source.organizeImports',
        name: 'Organize Imports',
      },
    ]
  })
  TextDocument.setFiles([
    {
      id: 1,
      languageId: 'typescript',
      text: '',
      uri: 'file:///test.ts',
    },
  ])
  ExtensionHostCodeActions.registerCodeActionProvider({
    languageId: 'typescript',
    provideCodeActions,
  })

  await expect(ExtensionHostCodeActions.getSourceActions(1, 14)).resolves.toEqual([
    {
      kind: 'source.organizeImports',
      languageId: 'typescript',
      name: 'Organize Imports',
    },
  ])
  expect(provideCodeActions).toHaveBeenCalledWith(TextDocument.get(1), 14)
  expect(executeMock).not.toHaveBeenCalled()
})

test('getSourceActions forwards arguments and returns isolated code action edits', async () => {
  TextDocument.setFiles([
    {
      id: 2,
      languageId: 'typescript',
      text: '',
      uri: 'file:///test.ts',
    },
  ])
  executeMock.mockResolvedValue({
    found: true,
    result: [
      {
        edits: [
          {
            endOffset: 28,
            inserted: 'abort',
            startOffset: 23,
          },
        ],
        kind: 'source.organizeImports',
        name: 'Organize Imports',
      },
    ],
  })

  await expect(ExtensionHostCodeActions.getSourceActions(2, 28)).resolves.toEqual([
    {
      edits: [
        {
          endOffset: 28,
          inserted: 'abort',
          startOffset: 23,
        },
      ],
      kind: 'source.organizeImports',
      languageId: 'typescript',
      name: 'Organize Imports',
    },
  ])
  expect(executeMock).toHaveBeenCalledWith('code action', 'provideCodeActions', 2, 28)
})

test('getSourceActions returns an empty array for a missing text document', async () => {
  await expect(ExtensionHostCodeActions.getSourceActions(999)).resolves.toEqual([])
  expect(executeMock).not.toHaveBeenCalled()
})
