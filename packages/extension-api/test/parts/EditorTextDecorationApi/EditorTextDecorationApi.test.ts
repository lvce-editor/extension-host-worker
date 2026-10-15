import { deepStrictEqual, rejects, throws } from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import {
  executeEditorTextDecorationProvider,
  registerEditorTextDecorationProvider,
  resetEditorTextDecorationProviderRegistry,
  type EditorTextDecoration,
} from '../../../src/parts/EditorTextDecorationApi/EditorTextDecorationApi.ts'

const document = { languageId: 'plaintext', selections: [], text: 'hello\nworld', uri: 'file:///test.txt' }
const decoration: EditorTextDecoration = { color: '#ff0000', endColumnIndex: 3, endRowIndex: 1, startColumnIndex: 1, startRowIndex: 0 }
beforeEach(resetEditorTextDecorationProviderRegistry)

test('aggregates independent providers and validates ranges and styles', async () => {
  registerEditorTextDecorationProvider({ id: 'first', provideEditorTextDecorations: () => [decoration] })
  registerEditorTextDecorationProvider({ id: 'second', provideEditorTextDecorations: () => [{ ...decoration, thickness: 4 }] })
  deepStrictEqual(await executeEditorTextDecorationProvider(document), [
    { ...decoration, thickness: 2 },
    { ...decoration, thickness: 4 },
  ])
})

test('disposal is idempotent and does not remove a replacement registration', async () => {
  const first = registerEditorTextDecorationProvider({ id: 'sample', provideEditorTextDecorations: () => [decoration] })
  first.dispose()
  registerEditorTextDecorationProvider({ id: 'sample', provideEditorTextDecorations: () => [] })
  first.dispose()
  deepStrictEqual(await executeEditorTextDecorationProvider(document), [])
})

test('disposal suppresses an in-flight provider result', async () => {
  const { promise, resolve } = Promise.withResolvers<readonly EditorTextDecoration[]>()
  const disposable = registerEditorTextDecorationProvider({ id: 'sample', provideEditorTextDecorations: () => promise })
  const result = executeEditorTextDecorationProvider(document)
  disposable.dispose()
  resolve([decoration])
  deepStrictEqual(await result, [])
})

test('rejects duplicate registrations', () => {
  const provider = { id: 'sample', provideEditorTextDecorations: () => [] }
  registerEditorTextDecorationProvider(provider)
  throws(() => registerEditorTextDecorationProvider(provider), /already registered/)
})

for (const invalid of [
  { ...decoration, startRowIndex: -1 },
  { ...decoration, startColumnIndex: 0.5 },
  { ...decoration, endColumnIndex: 0, endRowIndex: 0 },
  { ...decoration, color: 'red;display:none' },
  { ...decoration, thickness: 20 },
]) {
  test(`rejects invalid decoration ${JSON.stringify(invalid)}`, async () => {
    registerEditorTextDecorationProvider({ id: 'invalid', provideEditorTextDecorations: () => [invalid] })
    await rejects(executeEditorTextDecorationProvider(document), /invalid editor text decoration/)
  })
}
