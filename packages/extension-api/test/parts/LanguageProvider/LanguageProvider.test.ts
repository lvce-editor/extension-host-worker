import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert'
import { afterEach, test } from 'node:test'
import {
  executeLanguageProvider,
  executeOrganizeImportsProvider,
  registerCodeActionsProvider,
  registerDefinitionProvider,
  registerDocumentSymbolProvider,
  resetLanguageProviderRegistry,
} from '../../../src/parts/LanguageProvider/LanguageProvider.ts'

afterEach(() => {
  resetLanguageProviderRegistry()
})

test('registers and executes a language provider', async () => {
  registerDefinitionProvider({
    id: 'typescript.definition',
    languageId: 'typescript',
    provideDefinition(textDocument: unknown, offset: unknown) {
      return { offset, textDocument }
    },
  })
  const textDocument = { languageId: 'typescript', text: 'const x = 1', uri: '/test.ts' }
  deepStrictEqual(await executeLanguageProvider('definition', 'provideDefinition', textDocument, 6), {
    offset: 6,
    textDocument,
  })
})

test('dispose unregisters a language provider', async () => {
  const disposable = registerDefinitionProvider({
    id: 'typescript.definition',
    languageId: 'typescript',
    provideDefinition() {},
  })
  disposable.dispose()
  await rejects(
    executeLanguageProvider('definition', 'provideDefinition', { languageId: 'typescript' }),
    /No definition provider found for typescript/,
  )
})

test('registers and executes a document symbol provider', async () => {
  const textDocument = { languageId: 'typescript', text: 'class App {}', uri: '/test.ts' }
  const symbols = [
    {
      children: [],
      endOffset: 12,
      kind: 'class',
      name: 'App',
      selectionEndOffset: 9,
      selectionStartOffset: 6,
      startOffset: 0,
    },
  ]
  registerDocumentSymbolProvider({
    id: 'typescript.document-symbols',
    languageId: 'typescript',
    provideDocumentSymbols(actualTextDocument) {
      strictEqual(actualTextDocument, textDocument)
      return symbols
    },
  })

  strictEqual(await executeLanguageProvider('document symbol', 'provideDocumentSymbols', textDocument), symbols)
})

test('document symbol provider registration requires provideDocumentSymbols', () => {
  throws(
    () => registerDocumentSymbolProvider({ id: 'typescript.document-symbols', languageId: 'typescript' } as any),
    /document symbol provider typescript.document-symbols is missing provideDocumentSymbols function/,
  )
})

test('executes organize imports inside the isolated worker', async () => {
  let executionCount = 0
  registerCodeActionsProvider({
    id: 'typescript.code-actions',
    languageId: 'typescript',
    provideCodeActions() {
      return [
        {
          execute() {
            executionCount++
            return [{ inserted: 'import { x } from ./x' }]
          },
          kind: 'source.organizeImports',
        },
      ]
    },
  })
  deepStrictEqual(await executeOrganizeImportsProvider({ languageId: 'typescript' }), [{ inserted: 'import { x } from ./x' }])
  strictEqual(executionCount, 1)
})
