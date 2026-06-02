import { deepStrictEqual, strictEqual, throws } from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { executeViewProvider, getViewRegistrySnapshot, registerView, resetViewRegistry } from '../../../src/parts/ViewRegistry/ViewRegistry.ts'

beforeEach(() => {
  resetViewRegistry()
})

test('registerView registers and executes a view provider', () => {
  registerView({
    create() {
      return 'created'
    },
    icon: 'symbol-beaker',
    id: 'sample.views.testing',
    title: 'Testing',
  })

  strictEqual(executeViewProvider('sample.views.testing'), 'created')
  deepStrictEqual(getViewRegistrySnapshot(), {
    views: [
      {
        icon: 'symbol-beaker',
        id: 'sample.views.testing',
        title: 'Testing',
      },
    ],
  })
})

test('registerView rejects missing create function', () => {
  throws(() => {
    registerView({ id: 'sample.views.testing' } as any)
  }, /view sample\.views\.testing is missing create function/)
})

test('registerView rejects duplicate id', () => {
  const view = {
    create() {},
    id: 'sample.views.testing',
  }
  registerView(view)
  throws(() => {
    registerView(view)
  }, /view sample\.views\.testing is already registered/)
})
