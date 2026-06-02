import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
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
    format(document) {
      return [
        {
          endOffset: document.text.length,
          inserted: 'const value = 1',
          startOffset: 0,
        },
      ]
    },
    id: 'sample.formatting',
    languageId: 'sample',
  })

  const edits = await executeFormattingProvider(textDocument)

  strictEqual(edits[0]?.inserted, 'const value = 1')
})

test('registerFormattingProvider disposes provider', () => {
  const disposable = registerFormattingProvider({
    format() {
      return []
    },
    id: 'sample.formatting',
    languageId: 'sample',
  })

  strictEqual(getFormattingProviderRegistrySnapshot().providers.length, 1)
  disposable.dispose()
  strictEqual(getFormattingProviderRegistrySnapshot().providers.length, 0)
})

test('registerFormattingProvider rejects duplicate id', () => {
  registerFormattingProvider({
    format() {
      return []
    },
    id: 'sample.formatting',
    languageId: 'sample',
  })

  throws(() => {
    registerFormattingProvider({
      format() {
        return []
      },
      id: 'sample.formatting',
      languageId: 'sample',
    })
  }, /formatting provider sample\.formatting is already registered/)
})

test('registerFormattingProvider rejects missing language id', () => {
  throws(() => {
    registerFormattingProvider({
      format() {
        return []
      },
      id: 'sample.formatting',
      // @ts-expect-error testing invalid provider shape
      languageId: undefined,
    })
  }, /formatting provider sample\.formatting is missing languageId/)
})

test('registerFormattingProvider rejects missing format function', () => {
  throws(() => {
    registerFormattingProvider({
      // @ts-expect-error testing invalid provider shape
      format: undefined,
      id: 'sample.formatting',
      languageId: 'sample',
    })
  }, /formatting provider sample\.formatting is missing format function/)
})

test('executeFormattingProvider rejects missing provider', async () => {
  await rejects(() => executeFormattingProvider(textDocument), /No formatting provider found for sample/)
})

test('executeFormattingProvider propagates provider errors', async () => {
  registerFormattingProvider({
    format() {
      throw new Error('sample formatting failed')
    },
    id: 'sample.formatting',
    languageId: 'sample',
  })

  await rejects(() => executeFormattingProvider(textDocument), /sample formatting failed/)
})

test('getFormattingProviderRegistrySnapshot returns registered providers', () => {
  registerFormattingProvider({
    format() {
      return []
    },
    id: 'sample.formatting',
    languageId: 'sample',
  })

  deepStrictEqual(
    getFormattingProviderRegistrySnapshot().providers.map((provider) => provider.id),
    ['sample.formatting'],
  )
})
