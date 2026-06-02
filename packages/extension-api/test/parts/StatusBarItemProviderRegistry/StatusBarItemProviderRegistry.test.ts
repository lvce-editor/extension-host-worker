import { deepStrictEqual, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  getStatusBarItemProviderRegistrySnapshot,
  getStatusBarItems,
  registerStatusBarItemProvider,
  resetStatusBarItemProviderRegistry,
} from '../../../src/parts/StatusBarItemProviderRegistry/StatusBarItemProviderRegistry.ts'

afterEach(() => {
  resetStatusBarItemProviderRegistry()
})

test('registerStatusBarItemProvider registers and returns items', () => {
  const handle = registerStatusBarItemProvider({
    getStatusBarItem() {
      return {
        name: 'sample.status',
        text: 'Ready',
      }
    },
    id: 'sample.status',
  })

  strictEqual(getStatusBarItemProviderRegistrySnapshot().providers.length, 1)
  strictEqual(getStatusBarItems()[0]?.text, 'Ready')

  handle.dispose()
  strictEqual(getStatusBarItemProviderRegistrySnapshot().providers.length, 0)
})

test('getStatusBarItems filters undefined provider items', () => {
  registerStatusBarItemProvider({
    getStatusBarItem() {
      return undefined
    },
    id: 'sample.empty',
  })

  deepStrictEqual(getStatusBarItems(), [])
})

test('registerStatusBarItemProvider refresh resolves', async () => {
  const handle = registerStatusBarItemProvider({
    getStatusBarItem() {
      return undefined
    },
    id: 'sample.status',
  })

  await handle.refresh()
})

test('registerStatusBarItemProvider rejects duplicate id', () => {
  registerStatusBarItemProvider({
    getStatusBarItem() {
      return undefined
    },
    id: 'sample.status',
  })

  throws(() => {
    registerStatusBarItemProvider({
      getStatusBarItem() {
        return undefined
      },
      id: 'sample.status',
    })
  }, /status bar item provider sample\.status is already registered/)
})

test('registerStatusBarItemProvider rejects missing getStatusBarItem function', () => {
  throws(() => {
    registerStatusBarItemProvider({
      // @ts-expect-error testing invalid provider shape
      getStatusBarItem: undefined,
      id: 'sample.invalid',
    })
  }, /status bar item provider sample\.invalid is missing getStatusBarItem function/)
})

test('resetStatusBarItemProviderRegistry clears providers', () => {
  registerStatusBarItemProvider({
    getStatusBarItem() {
      return undefined
    },
    id: 'sample.reset',
  })

  resetStatusBarItemProviderRegistry()

  strictEqual(getStatusBarItemProviderRegistrySnapshot().providers.length, 0)
})
