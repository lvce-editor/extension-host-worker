import { afterEach, test } from 'node:test'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import {
  executeHoverProvider,
  getHoverProviderRegistrySnapshot,
  registerHoverProvider,
  resetHoverProviderRegistry,
} from '../../../src/parts/HoverProviderRegistry/HoverProviderRegistry.ts'

const textDocument = {
  languageId: 'sample',
  text: 'abc',
  uri: '/sample.txt',
}

afterEach(() => {
  resetHoverProviderRegistry()
})

test('executeHoverProvider returns hover from matching provider', async () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    provideHover(document, offset) {
      return {
        documentation: `${document.languageId}:${offset}`,
      }
    },
  })

  const hover = await executeHoverProvider(textDocument, 2)

  strictEqual(hover?.documentation, 'sample:2')
})

test('executeHoverProvider allows undefined hover result', async () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    provideHover() {
      return undefined
    },
  })

  const hover = await executeHoverProvider(textDocument, 2)

  strictEqual(hover, undefined)
})

test('registerHoverProvider disposes provider', () => {
  const disposable = registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    provideHover() {
      return undefined
    },
  })

  strictEqual(getHoverProviderRegistrySnapshot().providers.length, 1)
  disposable.dispose()
  strictEqual(getHoverProviderRegistrySnapshot().providers.length, 0)
})

test('registerHoverProvider rejects duplicate id', () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    provideHover() {
      return undefined
    },
  })

  throws(() => {
    registerHoverProvider({
      id: 'sample.hover',
      languageId: 'sample',
      provideHover() {
        return undefined
      },
    })
  }, /hover provider sample\.hover is already registered/)
})

test('registerHoverProvider rejects missing id', () => {
  throws(() => {
    registerHoverProvider({
      // @ts-expect-error testing invalid provider shape
      id: undefined,
      languageId: 'sample',
      provideHover() {
        return undefined
      },
    })
  }, /hover provider is missing id/)
})

test('registerHoverProvider rejects missing language id', () => {
  throws(() => {
    registerHoverProvider({
      id: 'sample.hover',
      // @ts-expect-error testing invalid provider shape
      languageId: undefined,
      provideHover() {
        return undefined
      },
    })
  }, /hover provider sample\.hover is missing languageId/)
})

test('registerHoverProvider rejects missing provideHover function', () => {
  throws(() => {
    registerHoverProvider({
      id: 'sample.hover',
      languageId: 'sample',
      // @ts-expect-error testing invalid provider shape
      provideHover: undefined,
    })
  }, /hover provider sample\.hover is missing provideHover function/)
})

test('executeHoverProvider rejects missing provider', async () => {
  await rejects(() => executeHoverProvider(textDocument, 0), /No hover provider found for sample/)
})

test('executeHoverProvider rejects primitive result', async () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    // @ts-expect-error testing invalid provider result
    provideHover() {
      return 123
    },
  })

  await rejects(() => executeHoverProvider(textDocument, 0), /invalid hover result: hover must be of type object or undefined but is number/)
})

test('executeHoverProvider rejects null result', async () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    // @ts-expect-error testing invalid provider result
    provideHover() {
      return null
    },
  })

  await rejects(() => executeHoverProvider(textDocument, 0), /invalid hover result: hover must be of type object or undefined but is null/)
})

test('executeHoverProvider rejects array result', async () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    // @ts-expect-error testing invalid provider result
    provideHover() {
      return []
    },
  })

  await rejects(() => executeHoverProvider(textDocument, 0), /invalid hover result: hover must be of type object or undefined but is array/)
})

test('executeHoverProvider propagates provider errors', async () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    provideHover() {
      throw new Error('sample hover failed')
    },
  })

  await rejects(() => executeHoverProvider(textDocument, 0), /sample hover failed/)
})

test('getHoverProviderRegistrySnapshot returns registered providers', () => {
  registerHoverProvider({
    id: 'sample.hover',
    languageId: 'sample',
    provideHover() {
      return undefined
    },
  })

  deepStrictEqual(
    getHoverProviderRegistrySnapshot().providers.map((provider) => provider.id),
    ['sample.hover'],
  )
})
