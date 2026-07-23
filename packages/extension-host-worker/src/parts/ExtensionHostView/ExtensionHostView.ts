import { diffTree, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VError } from '../VError/VError.ts'

export interface ViewEvent {
  readonly args?: readonly unknown[]
  readonly handler?: string
  readonly name?: string
  readonly type: string
  readonly value?: unknown
}

export interface ViewContext {
  readonly state?: unknown
  readonly uid: number
  readonly viewId: string
}

export interface VirtualDomViewInstance {
  readonly dispose?: () => unknown
  readonly handleEvent?: (event: ViewEvent) => unknown
  readonly render: () => readonly VirtualDomNode[] | Promise<readonly VirtualDomNode[]>
  readonly renderTitle?: () => string | Promise<string>
  readonly saveState?: () => unknown
}

export interface ViewRenderResultDom {
  readonly dom: readonly VirtualDomNode[]
  readonly title?: string
  readonly type: 'setDom'
}

export interface ViewRenderResultPatches {
  readonly patches: readonly unknown[]
  readonly title?: string
  readonly type: 'setPatches'
}

export type ViewRenderResult = ViewRenderResultDom | ViewRenderResultPatches

const state = {
  instances: Object.create(null) as Record<number, VirtualDomViewInstance>,
  renderedDoms: Object.create(null) as Record<number, readonly VirtualDomNode[]>,
  views: Object.create(null) as Record<string, any>,
}

const getViewDisplay = (view: any): string => {
  if (view && typeof view.id === 'string') {
    return ` ${view.id}`
  }
  return ''
}

export const registerView = (view: any): void => {
  try {
    if (!view) {
      throw new Error('view is not defined')
    }
    if (!view.id) {
      throw new Error('view is missing id')
    }
    if (!view.create) {
      throw new Error('view is missing create function')
    }
    if (view.id in state.views) {
      throw new Error('view cannot be registered multiple times')
    }
    state.views[view.id] = view
  } catch (error) {
    throw new VError(error, `Failed to register view${getViewDisplay(view)}`)
  }
}

export const executeViewProvider = async (id: string): Promise<any> => {
  const view = state.views[id]
  if (!view) {
    throw new Error(`view ${id} not found`)
  }
  return view.create()
}

function assertVirtualDomViewInstance(id: string, instance: unknown): asserts instance is VirtualDomViewInstance {
  if (!instance || typeof instance !== 'object') {
    throw new Error(`view ${id} did not return a view instance`)
  }
  if (typeof (instance as VirtualDomViewInstance).render !== 'function') {
    throw new TypeError(`view ${id} instance is missing render function`)
  }
}

const getVirtualDomInstance = (uid: number): VirtualDomViewInstance => {
  const instance = state.instances[uid]
  if (!instance) {
    throw new Error(`view instance ${uid} not found`)
  }
  return instance
}

const renderDom = async (instance: VirtualDomViewInstance): Promise<readonly VirtualDomNode[]> => {
  const dom = await instance.render()
  if (!Array.isArray(dom)) {
    throw new TypeError('view render result must be an array')
  }
  return dom
}

const withTitle = async (result: ViewRenderResult, instance: VirtualDomViewInstance): Promise<ViewRenderResult> => {
  if (typeof instance.renderTitle !== 'function') {
    return result
  }
  const title = await instance.renderTitle()
  if (typeof title !== 'string') {
    throw new TypeError('view renderTitle result must be a string')
  }
  return {
    ...result,
    title,
  }
}

export const createViewInstance = async (viewId: string, uid: number, context?: ViewContext): Promise<ViewRenderResult> => {
  const view = state.views[viewId]
  if (!view) {
    throw new Error(`view ${viewId} not found`)
  }
  if (view.kind !== 'virtualDom') {
    throw new Error(`view ${viewId} is not a virtual dom view`)
  }
  const instance = await view.create({
    ...context,
    uid,
    viewId,
  })
  assertVirtualDomViewInstance(viewId, instance)
  state.instances[uid] = instance
  const dom = await renderDom(instance)
  state.renderedDoms[uid] = dom
  return withTitle(
    {
      dom,
      type: 'setDom',
    },
    instance,
  )
}

export const dispatchViewEvent = async (uid: number, event: ViewEvent): Promise<ViewRenderResult> => {
  const instance = getVirtualDomInstance(uid)
  if (event.handler) {
    const handler = (instance as unknown as Readonly<Record<string, unknown>>)[event.handler]
    if (typeof handler !== 'function') {
      throw new TypeError(`view event handler ${event.handler} is not a function`)
    }
    await Reflect.apply(handler, instance, event.args || [])
  } else if (typeof instance.handleEvent === 'function') {
    await instance.handleEvent(event)
  }
  const oldDom = state.renderedDoms[uid] || []
  const newDom = await renderDom(instance)
  state.renderedDoms[uid] = newDom
  const patches = diffTree(oldDom, newDom)
  return withTitle(
    {
      patches,
      type: 'setPatches',
    },
    instance,
  )
}

export const saveViewInstanceState = async (uid: number): Promise<unknown> => {
  const instance = getVirtualDomInstance(uid)
  if (typeof instance.saveState !== 'function') {
    return undefined
  }
  return instance.saveState()
}

export const disposeViewInstance = async (uid: number): Promise<void> => {
  const instance = state.instances[uid]
  if (instance && typeof instance.dispose === 'function') {
    await instance.dispose()
  }
  delete state.instances[uid]
  delete state.renderedDoms[uid]
}

export const getRegisteredViewIds = (): readonly string[] => {
  return Object.values(state.views).map((view: any) => view.id)
}

export const reset = (): void => {
  state.instances = Object.create(null)
  state.renderedDoms = Object.create(null)
  state.views = Object.create(null)
}
