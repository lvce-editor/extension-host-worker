import { deepStrictEqual, rejects, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeEditorGutterDecorationProvider,
  registerEditorGutterDecorationProvider,
  resetEditorGutterDecorationProviderRegistry,
} from '../../../src/parts/EditorGutterDecorationProviderRegistry/EditorGutterDecorationProviderRegistry.ts'

const textDocument = {
  languageId: 'typescript',
  text: 'export const value = 1',
  uri: 'file:///workspace/file.ts',
}

afterEach(() => {
  resetEditorGutterDecorationProviderRegistry()
})

test('executeEditorGutterDecorationProvider returns flattened decorations from all registered providers', async () => {
  registerEditorGutterDecorationProvider({
    id: 'sample.first',
    provideEditorGutterDecorations(document) {
      return document.uri ? [{ rowIndex: 1, type: 'added' }] : []
    },
  })
  registerEditorGutterDecorationProvider({
    id: 'sample.second',
    provideEditorGutterDecorations() {
      return [
        { rowIndex: 2, type: 'modified' },
        { rowIndex: 3, type: 'deleted' },
      ]
    },
  })

  await deepStrictEqual(await executeEditorGutterDecorationProvider(textDocument), [
    { rowIndex: 1, type: 'added' },
    { rowIndex: 2, type: 'modified' },
    { rowIndex: 3, type: 'deleted' },
  ])
})

test('executeEditorGutterDecorationProvider returns an empty array when providers return no decorations', async () => {
  registerEditorGutterDecorationProvider({
    id: 'sample.empty',
    provideEditorGutterDecorations() {
      return []
    },
  })

  await deepStrictEqual(await executeEditorGutterDecorationProvider(textDocument), [])
})

test('registerEditorGutterDecorationProvider returns a disposable', async () => {
  const disposable = registerEditorGutterDecorationProvider({
    id: 'sample.decoration',
    provideEditorGutterDecorations() {
      return [{ rowIndex: 0, type: 'added' }]
    },
  })

  disposable.dispose()

  await deepStrictEqual(await executeEditorGutterDecorationProvider(textDocument), [])
})

test('registerEditorGutterDecorationProvider rejects duplicate ids', () => {
  const provider = {
    id: 'sample.decoration',
    provideEditorGutterDecorations() {
      return []
    },
  }
  registerEditorGutterDecorationProvider(provider)

  throws(() => registerEditorGutterDecorationProvider(provider), /editor gutter decoration provider sample\.decoration is already registered/)
})

test('executeEditorGutterDecorationProvider rejects a non-array result', async () => {
  registerEditorGutterDecorationProvider({
    id: 'sample.invalid',
    // @ts-expect-error testing invalid provider result
    provideEditorGutterDecorations() {
      return undefined
    },
  })

  await rejects(() => executeEditorGutterDecorationProvider(textDocument), /decorations must be an array/)
})

test('executeEditorGutterDecorationProvider rejects an invalid row index', async () => {
  registerEditorGutterDecorationProvider({
    id: 'sample.invalid',
    provideEditorGutterDecorations() {
      return [{ rowIndex: -1, type: 'added' }]
    },
  })

  await rejects(() => executeEditorGutterDecorationProvider(textDocument), /rowIndex must be a non-negative integer/)
})

test('executeEditorGutterDecorationProvider rejects an invalid decoration type', async () => {
  registerEditorGutterDecorationProvider({
    id: 'sample.invalid',
    // @ts-expect-error testing invalid provider result
    provideEditorGutterDecorations() {
      return [{ rowIndex: 0, type: 'warning' }]
    },
  })

  await rejects(() => executeEditorGutterDecorationProvider(textDocument), /decoration type must be added, deleted, or modified/)
})
