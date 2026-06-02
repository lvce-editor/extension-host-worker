import { afterEach, test } from 'node:test'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import {
  executeFormattingProvider,
  getFormattingProviderRegistrySnapshot,
  registerFormattingProvider,
  resetFormattingProviderRegistry,
} from '../../../src/parts/FormattingProviderRegistry/FormattingProviderRegistry.ts'

const textDocument = {
  documentId: 1,
  languageId: 'sample',
  text: 'const value=1',
  uri: '/sample.txt',
}

afterEach(() => {
  resetFormattingProviderRegistry()
})

test('executeFormattingProvider returns edits from matching provider', async () => {
  registerFormattingProvider({
    id: 'sample.formatting',
    languageId: 'sample',
    format(document) {
      return [
        {
          endOffset: document.text.length,
          inserted: 'const value = 1',
          startOffset: 0,
        },
      ]
    },
  })

  const edits = await executeFormattingProvider(textDocument)

  strictEqual(edits[0]?.inserted, 'const value = 1')
})

test('registerFormattingProvider disposes provider', () => {
  const disposable = registerFormattingProvider({
    id: 'sample.formatting',
    languageId: 'sample',
    format() {
      return []
    },
  })

  strictEqual(getFormattingProviderRegistrySnapshot().providers.length, 1)
  disposable.dispose()
  strictEqual(getFormattingProviderRegistrySnapshot().providers.length, 0)
})

test('registerFormattingProvider rejects duplicate id', () => {
  registerFormattingProvider({
    id: 'sample.formatting',
    languageId: 'sample',
    format() {
      return []
    },
  })

  throws(() => {
    registerFormattingProvider({
      id: 'sample.formatting',
      languageId: 'sample',
      format() {
        return []
      },
    })
  }, /formatting provider sample\.formatting is already registered/)
})

test('registerFormattingProvider rejects missing language id', () => {
  throws(() => {
    registerFormattingProvider({
      id: 'sample.formatting',
      // @ts-expect-error testing invalid provider shape
      languageId: undefined,
      format() {
        return []
      },
    })
  }, /formatting provider sample\.formatting is missing languageId/)
})

test('registerFormattingProvider rejects missing format function', () => {
  throws(() => {
    registerFormattingProvider({
      id: 'sample.formatting',
      languageId: 'sample',
      // @ts-expect-error testing invalid provider shape
      format: undefined,
    })
  }, /formatting provider sample\.formatting is missing format function/)
})

test('executeFormattingProvider rejects missing provider', async () => {
  await rejects(() => executeFormattingProvider(textDocument), /No formatting provider found for sample/)
})

test('executeFormattingProvider propagates provider errors', async () => {
  registerFormattingProvider({
    id: 'sample.formatting',
    languageId: 'sample',
    format() {
      throw new Error('sample formatting failed')
    },
  })

  await rejects(() => executeFormattingProvider(textDocument), /sample formatting failed/)
})

test('getFormattingProviderRegistrySnapshot returns registered providers', () => {
  registerFormattingProvider({
    id: 'sample.formatting',
    languageId: 'sample',
    format() {
      return []
    },
  })

  deepStrictEqual(
    getFormattingProviderRegistrySnapshot().providers.map((provider) => provider.id),
    ['sample.formatting'],
  )
})
