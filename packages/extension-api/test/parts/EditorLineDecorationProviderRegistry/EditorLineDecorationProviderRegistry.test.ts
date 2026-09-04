import { deepStrictEqual, rejects, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeEditorLineDecorationProvider,
  registerEditorLineDecorationProvider,
  resetEditorLineDecorationProviderRegistry,
} from '../../../src/parts/EditorLineDecorationProviderRegistry/EditorLineDecorationProviderRegistry.ts'

const textDocument = {
  languageId: 'typescript',
  text: 'export const value = 1',
  uri: 'file:///workspace/file.ts',
}

afterEach(() => {
  resetEditorLineDecorationProviderRegistry()
})

test('executeEditorLineDecorationProvider returns decorations from all registered providers', async () => {
  registerEditorLineDecorationProvider({
    id: 'sample.first',
    provideEditorLineDecoration(document, rowIndex) {
      return { text: `${document.uri}:${rowIndex}` }
    },
  })
  registerEditorLineDecorationProvider({
    id: 'sample.second',
    provideEditorLineDecoration() {
      return { text: 'second' }
    },
  })

  await deepStrictEqual(await executeEditorLineDecorationProvider(textDocument, 3), [{ text: 'file:///workspace/file.ts:3' }, { text: 'second' }])
})

test('executeEditorLineDecorationProvider omits undefined decorations', async () => {
  registerEditorLineDecorationProvider({
    id: 'sample.empty',
    provideEditorLineDecoration() {
      return undefined
    },
  })

  await deepStrictEqual(await executeEditorLineDecorationProvider(textDocument, 0), [])
})

test('registerEditorLineDecorationProvider returns a disposable', async () => {
  const disposable = registerEditorLineDecorationProvider({
    id: 'sample.decoration',
    provideEditorLineDecoration() {
      return { text: 'decoration' }
    },
  })

  disposable.dispose()

  await deepStrictEqual(await executeEditorLineDecorationProvider(textDocument, 0), [])
})

test('registerEditorLineDecorationProvider rejects duplicate ids', () => {
  const provider = {
    id: 'sample.decoration',
    provideEditorLineDecoration() {
      return undefined
    },
  }
  registerEditorLineDecorationProvider(provider)

  throws(() => registerEditorLineDecorationProvider(provider), /editor line decoration provider sample\.decoration is already registered/)
})

test('executeEditorLineDecorationProvider rejects invalid decoration text', async () => {
  registerEditorLineDecorationProvider({
    id: 'sample.invalid',
    // @ts-expect-error testing invalid provider result
    provideEditorLineDecoration() {
      return { text: 42 }
    },
  })

  await rejects(() => executeEditorLineDecorationProvider(textDocument, 0), /decoration text must be a string/)
})
