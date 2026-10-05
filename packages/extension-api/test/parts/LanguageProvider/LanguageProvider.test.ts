import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert'
import { afterEach, test } from 'node:test'
import {
  executeLanguageProvider,
  executeOrganizeImportsProvider,
  executeSourceActionProvider,
  registerCodeActionsProvider,
  registerDefinitionProvider,
  registerDocumentSymbolProvider,
  registerRenameProvider,
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

test('executes the rename preparation provider', async () => {
  const textDocument = { languageId: 'typescript', text: 'const value = 1', uri: '/test.ts' }
  const preparation = { placeholder: 'value', range: { end: 11, start: 6 } }
  registerRenameProvider({
    id: 'typescript.rename',
    languageId: 'typescript',
    prepareRename(actualTextDocument: unknown, offset: unknown) {
      strictEqual(actualTextDocument, textDocument)
      strictEqual(offset, 8)
      return preparation
    },
    provideRename() {},
  })
  strictEqual(await executeLanguageProvider('rename', 'prepareRename', textDocument, 8), preparation)
})

test('returns undefined when a rename provider does not support preparation', async () => {
  registerRenameProvider({
    id: 'typescript.rename',
    languageId: 'typescript',
    provideRename() {},
  })
  strictEqual(await executeLanguageProvider('rename', 'prepareRename', { languageId: 'typescript' }, 0), undefined)
})

test('propagates errors from the rename preparation provider', async () => {
  registerRenameProvider({
    id: 'typescript.rename',
    languageId: 'typescript',
    prepareRename() {
      throw new Error('prepare failed')
    },
    provideRename() {},
  })
  await rejects(executeLanguageProvider('rename', 'prepareRename', { languageId: 'typescript' }, 0), /prepare failed/)
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

test('executes the requested source action with the current document', async () => {
  const textDocument = { languageId: 'typescript', text: 'export const c = a + 1', uri: '/c.ts' }
  const edits = [{ inserted: "import { a } from './a'" }]
  registerCodeActionsProvider({
    id: 'typescript.code-actions',
    languageId: 'typescript',
    provideCodeActions(actualDocument: unknown) {
      strictEqual(actualDocument, textDocument)
      return [
        {
          execute() {
            throw new Error('wrong action')
          },
          kind: 'source.organizeImports',
        },
        {
          execute(actualDocument: unknown) {
            strictEqual(actualDocument, textDocument)
            return edits
          },
          kind: 'source.addMissingImports',
        },
      ]
    },
  })
  strictEqual(await executeSourceActionProvider(textDocument, 'source.addMissingImports'), edits)
  deepStrictEqual(await executeSourceActionProvider(textDocument, 'source.unknown'), [])
})

test('ignores source actions without an executable handler', async () => {
  registerCodeActionsProvider({
    id: 'typescript.code-actions',
    languageId: 'typescript',
    provideCodeActions() {
      return [{ kind: 'source.addMissingImports' }]
    },
  })
  deepStrictEqual(await executeSourceActionProvider({ languageId: 'typescript' }, 'source.addMissingImports'), [])
})

test('rejects invalid source action provider results', async () => {
  registerCodeActionsProvider({
    id: 'typescript.code-actions',
    languageId: 'typescript',
    provideCodeActions() {
      return null
    },
  })
  await rejects(executeSourceActionProvider({ languageId: 'typescript' }, 'source.addMissingImports'), /code actions must be of type array/)
})
