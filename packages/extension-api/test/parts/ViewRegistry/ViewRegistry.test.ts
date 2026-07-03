import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import {
  createViewInstance,
  dispatchViewEvent,
  disposeViewInstance,
  executeViewProvider,
  getViewRegistrySnapshot,
  registerView,
  renderViewInstance,
  resetViewRegistry,
  saveViewInstanceState,
} from '../../../src/parts/ViewRegistry/ViewRegistry.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

beforeEach(() => {
  resetViewRegistry()
})

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
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
        displayName: 'Testing',
        icon: 'symbol-beaker',
        id: 'sample.views.testing',
        name: undefined,
        title: 'Testing',
      },
    ],
  })
})

test('registerView uses displayName as canonical title in registry snapshot', () => {
  registerView({
    create() {
      return 'created'
    },
    displayName: 'Testing Display',
    id: 'sample.views.testing',
    name: 'Testing Name',
    title: 'Testing Title',
  })

  deepStrictEqual(getViewRegistrySnapshot(), {
    views: [
      {
        displayName: 'Testing Display',
        icon: undefined,
        id: 'sample.views.testing',
        name: 'Testing Name',
        title: 'Testing Display',
      },
    ],
  })
})

test('registerView falls back from title for registry displayName', () => {
  registerView({
    create() {
      return 'created'
    },
    id: 'sample.views.testing',
    title: 'Testing Title',
  })

  deepStrictEqual(getViewRegistrySnapshot(), {
    views: [
      {
        displayName: 'Testing Title',
        icon: undefined,
        id: 'sample.views.testing',
        name: undefined,
        title: 'Testing Title',
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
        displayName: undefined,
        icon: undefined,
        id: 'sample.views.testing',
        kind: 'virtualDom',
        name: undefined,
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

test('createViewInstance passes requestRerender in context', async () => {
  let requestRerender: (() => Promise<void>) | undefined
  const invocations: unknown[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.requestViewRerender'(uid: number): Promise<void> {
      invocations.push(uid)
    },
  })
  registerView({
    create(context) {
      requestRerender = context?.requestRerender
      return {
        render() {
          return []
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)
  await requestRerender?.()

  deepStrictEqual(invocations, [1])
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

test('renderViewInstance returns patches after state changes', async () => {
  let value = ''
  registerView({
    create() {
      return {
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
  value = 'abc'
  const result = await renderViewInstance(1)

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
