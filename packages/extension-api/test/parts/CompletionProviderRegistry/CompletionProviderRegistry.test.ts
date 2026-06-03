import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeCompletionProvider,
  executeResolveCompletionItemProvider,
  getCompletionProviderRegistrySnapshot,
  registerCompletionProvider,
  resetCompletionProviderRegistry,
} from '../../../src/parts/CompletionProviderRegistry/CompletionProviderRegistry.ts'

const textDocument = {
  languageId: 'sample',
  text: 'abc',
  uri: '/sample.txt',
}

afterEach(() => {
  resetCompletionProviderRegistry()
})

test('executeCompletionProvider returns completions from matching provider', async () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions(document, offset) {
      return [
        {
          label: `${document.languageId}:${offset}`,
        },
      ]
    },
  })

  const completions = await executeCompletionProvider(textDocument, 2)

  strictEqual(completions[0]?.label, 'sample:2')
})

test('executeResolveCompletionItemProvider returns resolved completion item', async () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
    resolveCompletionItem(document, offset, name, completionItem) {
      return {
        ...completionItem,
        detail: `${document.languageId}:${offset}:${name}`,
      }
    },
  })

  const completion = await executeResolveCompletionItemProvider(textDocument, 3, 'value', {
    label: 'value',
  })

  strictEqual(completion?.detail, 'sample:3:value')
})

test('executeResolveCompletionItemProvider returns undefined when resolver is omitted', async () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
  })

  const completion = await executeResolveCompletionItemProvider(textDocument, 3, 'value', {
    label: 'value',
  })

  strictEqual(completion, undefined)
})

test('registerCompletionProvider disposes provider', () => {
  const disposable = registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
  })

  strictEqual(getCompletionProviderRegistrySnapshot().providers.length, 1)
  disposable.dispose()
  strictEqual(getCompletionProviderRegistrySnapshot().providers.length, 0)
})

test('registerCompletionProvider rejects duplicate id', () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
  })

  throws(() => {
    registerCompletionProvider({
      id: 'sample.completion',
      languageId: 'sample',
      provideCompletions() {
        return []
      },
    })
  }, /completion provider sample\.completion is already registered/)
})

test('registerCompletionProvider rejects missing language id', () => {
  throws(() => {
    registerCompletionProvider({
      id: 'sample.completion',
      // @ts-expect-error testing invalid provider shape
      languageId: undefined,
      provideCompletions() {
        return []
      },
    })
  }, /completion provider sample\.completion is missing languageId/)
})

test('registerCompletionProvider rejects invalid optional resolver', () => {
  throws(() => {
    registerCompletionProvider({
      id: 'sample.completion',
      languageId: 'sample',
      provideCompletions() {
        return []
      },
      // @ts-expect-error testing invalid provider shape
      resolveCompletionItem: 'nope',
    })
  }, /completion provider sample\.completion has invalid resolveCompletionItem function/)
})

test('executeCompletionProvider rejects missing provider', async () => {
  await rejects(() => executeCompletionProvider(textDocument, 0), /No completion provider found for sample/)
})

test('executeResolveCompletionItemProvider rejects missing provider', async () => {
  await rejects(
    () =>
      executeResolveCompletionItemProvider(textDocument, 0, 'value', {
        label: 'value',
      }),
    /No completion provider found for sample/,
  )
})

test('executeCompletionProvider rejects non-array result', async () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    // @ts-expect-error testing invalid provider result
    provideCompletions() {
      return 123
    },
  })

  await rejects(() => executeCompletionProvider(textDocument, 0), /invalid completion result: completion must be of type array but is number/)
})

test('executeCompletionProvider rejects invalid item result', async () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    // @ts-expect-error testing invalid provider result
    provideCompletions() {
      return [null]
    },
  })

  await rejects(
    () => executeCompletionProvider(textDocument, 0),
    /invalid completion result: expected completion item to be of type object but was of type null/,
  )
})

test('getCompletionProviderRegistrySnapshot returns registered providers', () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
  })

  deepStrictEqual(
    getCompletionProviderRegistrySnapshot().providers.map((provider) => provider.id),
    ['sample.completion'],
  )
})

test('getCompletionProviderRegistrySnapshot omits provider functions', () => {
  registerCompletionProvider({
    id: 'sample.completion',
    languageId: 'sample',
    provideCompletions() {
      return []
    },
    resolveCompletionItem() {
      return undefined
    },
  })

  deepStrictEqual(getCompletionProviderRegistrySnapshot(), {
    providers: [
      {
        id: 'sample.completion',
        languageId: 'sample',
      },
    ],
  })
})
