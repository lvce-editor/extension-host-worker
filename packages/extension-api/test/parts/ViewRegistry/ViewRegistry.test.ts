import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import type { VirtualDomViewInstance } from '../../../src/parts/View/View.ts'
import { executeCommand, getCommandRegistrySnapshot } from '../../../src/parts/CommandRegistry/CommandRegistry.ts'
import {
  createViewInstance,
  dispatchViewEvent,
  disposeViewInstance,
  executeViewProvider,
  getViewActions,
  getViewMenuEntries,
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

interface CounterViewInstance extends VirtualDomViewInstance {
  readonly value: number
}

interface UidViewInstance extends VirtualDomViewInstance {
  readonly uid: number
}

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

test('registerView registers and disposes view commands', () => {
  const disposable = registerView({
    commands: {
      'sample.increment'(state) {
        return state
      },
    },
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

  deepStrictEqual(
    getCommandRegistrySnapshot().commands.map((command) => command.id),
    ['sample.increment'],
  )

  disposable.dispose()
  deepStrictEqual(getCommandRegistrySnapshot().commands, [])
})

test('registerView rejects invalid view commands', () => {
  throws(() => {
    registerView({
      commands: {
        'sample.increment': undefined,
      },
      create() {
        return {
          render() {
            return []
          },
        }
      },
      id: 'sample.views.testing',
      kind: 'virtualDom',
    } as any)
  }, /view sample\.views\.testing command sample\.increment must be a function/)
})

test('registerView rejects commands for non-virtual-dom views', () => {
  throws(() => {
    registerView({
      commands: {},
      create() {},
      id: 'sample.views.testing',
    })
  }, /view sample\.views\.testing commands require virtualDom kind/)
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

test('registerView includes event listeners in registry snapshot', () => {
  const eventListeners = [
    {
      name: 'handleDragStart',
      params: ['handleViewEvent', 'dragstart', 'event.target.name'],
    },
    {
      name: 'handleDrop',
      params: ['handleViewEvent', 'drop', 'event.target.name'],
      preventDefault: true,
      trackPointerEvents: ['handlePointerMove', 'handlePointerUp'],
    },
  ]
  registerView({
    create() {
      return {
        render() {
          return []
        },
      }
    },
    eventListeners,
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(getViewRegistrySnapshot(), {
    views: [
      {
        displayName: undefined,
        eventListeners,
        icon: undefined,
        id: 'sample.views.testing',
        kind: 'virtualDom',
        name: undefined,
        title: undefined,
      },
    ],
  })
})

test('registerView rejects invalid event listeners', () => {
  throws(() => {
    registerView({
      create() {},
      eventListeners: [
        {
          name: 'handleClick',
          params: ['handleClick'],
          preventDefault: 'yes',
        },
      ],
      id: 'sample.views.testing',
      kind: 'virtualDom',
    } as any)
  }, /view sample\.views\.testing event listener 0 has invalid preventDefault/)
})

test('registerView rejects invalid tracked pointer events', () => {
  throws(() => {
    registerView({
      create() {},
      eventListeners: [
        {
          name: 'handlePointerDown',
          params: ['handlePointerDown'],
          trackPointerEvents: ['handlePointerMove', true],
        },
      ],
      id: 'sample.views.testing',
      kind: 'virtualDom',
    } as any)
  }, /view sample\.views\.testing event listener 0 has invalid trackPointerEvents/)
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

test('createViewInstance passes showContextMenu in context', async () => {
  let showContextMenu: ((menuId: string, x: number, y: number) => Promise<void>) | undefined
  const invocations: unknown[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.showViewContextMenu'(uid: number, viewId: string, menuId: string, x: number, y: number): Promise<void> {
      invocations.push([uid, viewId, menuId, x, y])
    },
  })
  registerView({
    create(context) {
      showContextMenu = context?.showContextMenu
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
  await showContextMenu?.('sample.menu', 10, 20)

  deepStrictEqual(invocations, [[1, 'sample.views.testing', 'sample.menu', 10, 20]])
})

test('view command updates the active instance and requests a rerender', async () => {
  const rerenderedUids: number[] = []
  const values: number[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.requestViewRerender'(uid: number): Promise<void> {
      rerenderedUids.push(uid)
    },
  })
  registerView<CounterViewInstance>({
    commands: {
      'sample.increment'(state, amount: number) {
        values.push(state.value)
        return {
          ...state,
          value: state.value + amount,
        }
      },
    },
    create() {
      return {
        render() {
          return []
        },
        value: 0,
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)
  await executeCommand('sample.increment', 2)
  await executeCommand('sample.increment', 3)

  deepStrictEqual(values, [0, 2])
  deepStrictEqual(rerenderedUids, [1, 1])
})

test('view command targets the most recently used instance', async () => {
  const executedUids: number[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.requestViewRerender'(): Promise<void> {},
  })
  registerView<UidViewInstance>({
    commands: {
      'sample.run'(state) {
        executedUids.push(state.uid)
        return state
      },
    },
    create(context) {
      return {
        render() {
          return []
        },
        uid: context!.uid,
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)
  await createViewInstance('sample.views.testing', 2)
  await executeCommand('sample.run')
  await dispatchViewEvent(1, { type: 'focus' })
  await executeCommand('sample.run')

  deepStrictEqual(executedUids, [2, 1])
})

test('view command falls back to the previous instance after disposal', async () => {
  const executedUids: number[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.requestViewRerender'(): Promise<void> {},
  })
  registerView<UidViewInstance>({
    commands: {
      'sample.run'(state) {
        executedUids.push(state.uid)
        return state
      },
    },
    create(context) {
      return {
        render() {
          return []
        },
        uid: context!.uid,
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)
  await createViewInstance('sample.views.testing', 2)
  await disposeViewInstance(2)
  await executeCommand('sample.run')

  deepStrictEqual(executedUids, [1])
})

test('view command is a no-op when no instance exists', async () => {
  registerView({
    commands: {
      'sample.run'(state) {
        return state
      },
    },
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

  await executeCommand('sample.run')
})

test('view command rejects an invalid state result', async () => {
  registerView({
    commands: {
      'sample.run'() {
        return undefined as any
      },
    },
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

  await createViewInstance('sample.views.testing', 1)
  await rejects(executeCommand('sample.run'), /view sample\.views\.testing did not return a view instance/)
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

test('getCss is included after every view render', async () => {
  let width = 360
  registerView({
    create() {
      return {
        getCss() {
          return `.Detail { --DetailWidth: ${width}px; }`
        },
        handleEvent() {
          width = 400
        },
        render() {
          return []
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    css: '.Detail { --DetailWidth: 360px; }',
    dom: [],
    type: 'setDom',
  })
  deepStrictEqual(await dispatchViewEvent(1, { type: 'pointermove' }), {
    css: '.Detail { --DetailWidth: 400px; }',
    patches: [],
    type: 'setPatches',
  })
  deepStrictEqual(await renderViewInstance(1), {
    css: '.Detail { --DetailWidth: 400px; }',
    patches: [],
    type: 'setPatches',
  })
})

test('getCss rejects non-string results', async () => {
  registerView({
    create() {
      return {
        getCss() {
          return 42 as any
        },
        render() {
          return []
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await rejects(createViewInstance('sample.views.testing', 1), /view getCss result must be a string/)
})

test('view context changes are reported after lifecycle updates', async () => {
  const invocations: unknown[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleViewContextChange'(uid: number, viewId: string, context: Readonly<Record<string, boolean>>): Promise<void> {
      invocations.push([uid, viewId, context])
    },
  })
  let focused = true
  registerView({
    create() {
      return {
        getContext() {
          return focused ? { 'sample.focus': true } : {}
        },
        handleEvent() {
          focused = false
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
  await renderViewInstance(1)
  await dispatchViewEvent(1, { type: 'blur' })
  await disposeViewInstance(1)

  deepStrictEqual(invocations, [
    [1, 'sample.views.testing', { 'sample.focus': true }],
    [1, 'sample.views.testing', {}],
  ])
})

test('renderTitle is included after lifecycle updates', async () => {
  let title = 'Testing'
  registerView({
    create() {
      return {
        handleEvent() {
          title = 'Testing: Updated'
        },
        render() {
          return []
        },
        renderTitle() {
          return title
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    dom: [],
    title: 'Testing',
    type: 'setDom',
  })
  deepStrictEqual(await dispatchViewEvent(1, { type: 'click' }), {
    patches: [],
    title: 'Testing: Updated',
    type: 'setPatches',
  })
  deepStrictEqual(await renderViewInstance(1), {
    patches: [],
    title: 'Testing: Updated',
    type: 'setPatches',
  })
})

test('renderTitle rejects non-string results', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderTitle() {
          return 42 as any
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await rejects(createViewInstance('sample.views.testing', 1), /view renderTitle result must be a string/)
})

test('renderFocus is included after context changes', async () => {
  const contextInvocations: unknown[] = []
  const focusInvocations: unknown[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleViewContextChange'(uid: number, viewId: string, context: Readonly<Record<string, boolean>>): Promise<void> {
      contextInvocations.push([uid, viewId, context])
    },
  })
  let focused = true
  registerView({
    create() {
      return {
        getContext() {
          return focused ? { 'sample.focus': true } : { 'sample.nextFocus': true }
        },
        handleEvent() {
          focused = false
        },
        render() {
          return []
        },
        renderFocus(oldContext: Readonly<Record<string, boolean>>, newContext: Readonly<Record<string, boolean>>) {
          focusInvocations.push([oldContext, newContext])
          if (newContext['sample.focus']) {
            return '[name="first"]'
          }
          return '[name="next"]'
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    dom: [],
    focusSelector: '[name="first"]',
    type: 'setDom',
  })
  deepStrictEqual(await renderViewInstance(1), {
    patches: [],
    type: 'setPatches',
  })
  deepStrictEqual(await dispatchViewEvent(1, { type: 'click' }), {
    focusSelector: '[name="next"]',
    patches: [],
    type: 'setPatches',
  })

  deepStrictEqual(contextInvocations, [
    [1, 'sample.views.testing', { 'sample.focus': true }],
    [1, 'sample.views.testing', { 'sample.nextFocus': true }],
  ])
  deepStrictEqual(focusInvocations, [
    [{}, { 'sample.focus': true }],
    [{ 'sample.focus': true }, { 'sample.nextFocus': true }],
  ])
})

test('renderFocus empty selector is omitted', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleViewContextChange'(): Promise<void> {},
  })
  registerView({
    create() {
      return {
        getContext() {
          return { 'sample.focus': true }
        },
        render() {
          return []
        },
        renderFocus() {
          return ''
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    dom: [],
    type: 'setDom',
  })
})

test('renderFocus rejects non-string results', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.handleViewContextChange'(): Promise<void> {},
  })
  registerView({
    create() {
      return {
        getContext() {
          return { 'sample.focus': true }
        },
        render() {
          return []
        },
        renderFocus() {
          return 42 as any
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await rejects(createViewInstance('sample.views.testing', 1), /view renderFocus result must be a string/)
})

test('renderSelections is included after every view render', async () => {
  let selectionStart = 0
  registerView({
    create() {
      return {
        handleEvent() {
          selectionStart = 1
        },
        render() {
          return []
        },
        renderSelections() {
          return [
            {
              end: 4,
              name: 'title',
              start: selectionStart,
            },
          ]
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    dom: [],
    selections: [{ end: 4, name: 'title', start: 0 }],
    type: 'setDom',
  })
  deepStrictEqual(await dispatchViewEvent(1, { type: 'focus' }), {
    patches: [],
    selections: [{ end: 4, name: 'title', start: 1 }],
    type: 'setPatches',
  })
  deepStrictEqual(await renderViewInstance(1), {
    patches: [],
    selections: [{ end: 4, name: 'title', start: 1 }],
    type: 'setPatches',
  })
})

test('renderSelections empty result is omitted', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderSelections() {
          return []
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    dom: [],
    type: 'setDom',
  })
})

test('renderSelections rejects invalid results', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderSelections() {
          return [{ end: 4, name: '', start: 0 }]
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await rejects(createViewInstance('sample.views.testing', 1), /view selection 0 is missing name/)
})

test('renderScrollPosition is included after every view render', async () => {
  let scrollTop = 100
  registerView({
    create() {
      return {
        handleEvent() {
          scrollTop = 200
        },
        render() {
          return []
        },
        renderScrollPosition() {
          return ['.Messages', scrollTop] as const
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    dom: [],
    scrollPosition: ['.Messages', 100],
    type: 'setDom',
  })
  deepStrictEqual(await dispatchViewEvent(1, { type: 'click' }), {
    patches: [],
    scrollPosition: ['.Messages', 200],
    type: 'setPatches',
  })
  deepStrictEqual(await renderViewInstance(1), {
    patches: [],
    scrollPosition: ['.Messages', 200],
    type: 'setPatches',
  })
})

test('renderScrollPosition empty result is omitted', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderScrollPosition() {
          return [] as const
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  deepStrictEqual(await createViewInstance('sample.views.testing', 1), {
    dom: [],
    type: 'setDom',
  })
})

test('renderScrollPosition rejects invalid results', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderScrollPosition() {
          return ['.Messages'] as any
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await rejects(createViewInstance('sample.views.testing', 1), /view scroll position must contain a selector and scroll top/)
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

test('getViewMenuEntries returns normalized menu entries', async () => {
  registerView({
    create() {
      return {
        getMenuEntries(menuId: string) {
          return [
            {
              args: ['card-1'],
              command: 'sample.open',
              id: menuId,
              label: 'Open',
            },
          ]
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

  deepStrictEqual(await getViewMenuEntries(1, 'sample.card'), [
    {
      args: ['card-1'],
      command: 'sample.open',
      flags: 0,
      id: 'sample.card',
      label: 'Open',
    },
  ])
})

test('getViewMenuEntries returns empty array when instance has no menu provider', async () => {
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

  await createViewInstance('sample.views.testing', 1)

  deepStrictEqual(await getViewMenuEntries(1, 'sample.card'), [])
})

test('getViewMenuEntries rejects invalid menu entries', async () => {
  registerView({
    create() {
      return {
        getMenuEntries() {
          return [
            {
              command: 'sample.open',
              id: 'open',
            },
          ] as any
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

  await rejects(async () => getViewMenuEntries(1, 'sample.card'), /menu entry 0 is missing label/)
})

test('getViewActions returns normalized view actions', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderActions() {
          return [
            {
              command: 'sample.refresh',
              icon: 'Refresh',
              title: 'Refresh',
            },
          ]
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)

  deepStrictEqual(await getViewActions(1), [
    {
      command: 'sample.refresh',
      icon: 'Refresh',
      title: 'Refresh',
    },
  ])
})

test('getViewActions returns empty array when instance has no action renderer', async () => {
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

  await createViewInstance('sample.views.testing', 1)

  deepStrictEqual(await getViewActions(1), [])
})

test('getViewActions rejects invalid action result', async () => {
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderActions() {
          return [
            {
              command: 'sample.refresh',
              title: 'Refresh',
            },
          ] as any
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await createViewInstance('sample.views.testing', 1)

  await rejects(async () => getViewActions(1), /view action 0 is missing icon/)
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
