import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import {
  createViewInstance,
  dispatchViewEvent,
  disposeViewInstance,
  executeViewProvider,
  getViewRegistrySnapshot,
  registerView,
  resetViewRegistry,
  saveViewInstanceState,
} from '../../../src/parts/ViewRegistry/ViewRegistry.ts'

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

test('registerView includes virtual dom kind in registry snapshot', () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(getViewRegistrySnapshot(), {
    views: [
      {
        icon: undefined,
        id: 'sample.views.testing',
        kind: 'virtualDom',
        title: undefined,
      },
    ],
  })
})

test('createViewInstance renders initial virtual dom', async () => {
  registerView({
    create(context) {
      return {
        render() {
          return [
            {
              childCount: 0,
              className: 'TestView',
              text: `uid:${context?.uid}`,
              type: 4,
            },
          ] as any
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  const result = await createViewInstance('sample.views.testing', 1)
  strictEqual(result.type, 'setDom')
})

test('dispatchViewEvent returns patches after handling event', async () => {
  let value = ''
  registerView({
    create() {
      return {
        handleEvent(event: any) {
          value = `${event.value}`
        },
        render() {
          return [
            {
              childCount: 0,
              text: value,
              type: 4,
            },
          ] as any
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)
  const result = await dispatchViewEvent(1, {
    type: 'input',
    value: 'abc',
  })

  strictEqual(result.type, 'setPatches')
})

test('saveViewInstanceState returns instance state', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        saveState() {
          return {
            value: 'abc',
          }
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)
  deepStrictEqual(await saveViewInstanceState(1), {
    value: 'abc',
  })
})

test('disposeViewInstance disposes and removes instance', async () => {
  let disposed = false
  registerView({
    create() {
      return {
        dispose() {
          disposed = true
        },
        render() {
          return []
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)
  await disposeViewInstance(1)

  strictEqual(disposed, true)
  await rejects(async () => dispatchViewEvent(1, { type: 'click' }), /view instance 1 not found/)
})
