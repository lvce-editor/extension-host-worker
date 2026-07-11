import { deepStrictEqual, rejects, strictEqual } from 'node:assert'
import { afterEach, test } from 'node:test'
import {
  executeLanguageProvider,
  executeOrganizeImportsProvider,
  registerDefinitionProvider,
  registerCodeActionsProvider,
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
