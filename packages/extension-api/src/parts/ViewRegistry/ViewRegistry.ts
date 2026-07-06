import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { diffTree, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { Disposable } from '../Disposable/Disposable.ts'
import type {
  DomEventListener,
  RegisteredView,
  View,
  ViewContext,
  ViewEvent,
  ViewRegistrySnapshot,
  ViewRenderResult,
  VirtualDomViewInstance,
} from '../View/View.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const views: Record<string, View> = Object.create(null)
const instances: Record<number, VirtualDomViewInstance> = Object.create(null)
const renderedDoms: Record<number, readonly VirtualDomNode[]> = Object.create(null)

const assertBoolean = (value: unknown, message: string): void => {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new ExtensionApiError(message)
  }
}

const assertEventListener: (viewId: string, listener: unknown, index: number) => asserts listener is DomEventListener = (viewId, listener, index) => {
  if (!listener || typeof listener !== 'object') {
    throw new ExtensionApiError(`view ${viewId} event listener ${index} must be an object`)
  }
  const eventListener = listener as DomEventListener
  if (typeof eventListener.name !== 'string' && typeof eventListener.name !== 'number') {
    throw new ExtensionApiError(`view ${viewId} event listener ${index} is missing name`)
  }
  if (!Array.isArray(eventListener.params) || eventListener.params.some((param) => typeof param !== 'string')) {
    throw new ExtensionApiError(`view ${viewId} event listener ${index} is missing params`)
  }
  assertBoolean(eventListener.capture, `view ${viewId} event listener ${index} has invalid capture`)
  assertBoolean(eventListener.passive, `view ${viewId} event listener ${index} has invalid passive`)
  assertBoolean(eventListener.preventDefault, `view ${viewId} event listener ${index} has invalid preventDefault`)
  assertBoolean(eventListener.stopPropagation, `view ${viewId} event listener ${index} has invalid stopPropagation`)
}

const assertEventListeners = (view: View): void => {
  if (view.eventListeners === undefined) {
    return
  }
  if (!Array.isArray(view.eventListeners)) {
    throw new ExtensionApiError(`view ${view.id} eventListeners must be an array`)
  }
  view.eventListeners.forEach((listener, index) => {
    assertEventListener(view.id, listener, index)
  })
}

const assertView = (view: View): void => {
  if (!view) {
    throw new ExtensionApiError('view is not defined')
  }
  if (typeof view.id !== 'string' || view.id.length === 0) {
    throw new ExtensionApiError('view is missing id')
  }
  if (typeof view.create !== 'function') {
    throw new ExtensionApiError(`view ${view.id} is missing create function`)
  }
  if (view.id in views) {
    throw new ExtensionApiError(`view ${view.id} is already registered`)
  }
  assertEventListeners(view)
}

const toRegisteredView = (view: View): RegisteredView => {
  const displayName = view.displayName || view.name || view.title
  const registeredView: RegisteredView = {
    displayName,
    ...(view.eventListeners && { eventListeners: view.eventListeners }),
    icon: view.icon,
    id: view.id,
    name: view.name,
    title: displayName,
  }
  if (view.kind) {
    return {
      ...registeredView,
      kind: view.kind,
    }
  }
  return registeredView
}

export const registerView = (view: View): Disposable => {
  assertView(view)
  views[view.id] = view
  return {
    dispose(): void {
      delete views[view.id]
    },
  }
}

export const executeViewProvider = (id: string): unknown => {
  const view = views[id]
  if (!view) {
    throw new ExtensionApiError(`view ${id} not found`)
  }
  return view.create()
}

const assertVirtualDomViewInstance: (id: string, instance: unknown) => asserts instance is VirtualDomViewInstance = (id, instance) => {
  if (!instance || typeof instance !== 'object') {
    throw new ExtensionApiError(`view ${id} did not return a view instance`)
  }
  if (typeof (instance as VirtualDomViewInstance).render !== 'function') {
    throw new ExtensionApiError(`view ${id} instance is missing render function`)
  }
}

const getVirtualDomInstance = (uid: number): VirtualDomViewInstance => {
  const instance = instances[uid]
  if (!instance) {
    throw new ExtensionApiError(`view instance ${uid} not found`)
  }
  return instance
}

const renderDom = async (instance: VirtualDomViewInstance): Promise<readonly VirtualDomNode[]> => {
  const dom = await instance.render()
  if (!Array.isArray(dom)) {
    throw new ExtensionApiError('view render result must be an array')
  }
  return dom
}

const renderPatches = async (uid: number, instance: VirtualDomViewInstance): Promise<ViewRenderResult> => {
  const oldDom = renderedDoms[uid] || []
  const newDom = await renderDom(instance)
  renderedDoms[uid] = newDom
  const patches = diffTree(oldDom, newDom)
  return {
    patches,
    type: 'setPatches',
  }
}

export const createViewInstance = async (viewId: string, uid: number, context?: ViewContext): Promise<ViewRenderResult> => {
  const view = views[viewId]
  if (!view) {
    throw new ExtensionApiError(`view ${viewId} not found`)
  }
  if (view.kind !== 'virtualDom') {
    throw new ExtensionApiError(`view ${viewId} is not a virtual dom view`)
  }
  const instance = await view.create({
    ...context,
    requestRerender() {
      return ExtensionManagementWorker.invoke('Extensions.requestViewRerender', uid) as Promise<void>
    },
    uid,
    viewId,
  })
  assertVirtualDomViewInstance(viewId, instance)
  instances[uid] = instance
  const dom = await renderDom(instance)
  renderedDoms[uid] = dom
  return {
    dom,
    type: 'setDom',
  }
}

export const dispatchViewEvent = async (uid: number, event: ViewEvent): Promise<ViewRenderResult> => {
  const instance = getVirtualDomInstance(uid)
  if (typeof instance.handleEvent === 'function') {
    await instance.handleEvent(event)
  }
  return renderPatches(uid, instance)
}

export const renderViewInstance = async (uid: number): Promise<ViewRenderResult> => {
  const instance = getVirtualDomInstance(uid)
  return renderPatches(uid, instance)
}

export const disposeViewInstance = async (uid: number): Promise<void> => {
  const instance = instances[uid]
  if (instance && typeof instance.dispose === 'function') {
    await instance.dispose()
  }
  delete instances[uid]
  delete renderedDoms[uid]
}

export const saveViewInstanceState = async (uid: number): Promise<unknown> => {
  const instance = getVirtualDomInstance(uid)
  if (typeof instance.saveState !== 'function') {
    return undefined
  }
  return instance.saveState()
}

export const getViewRegistrySnapshot = (): ViewRegistrySnapshot => {
  return {
    views: Object.values(views).map(toRegisteredView),
  }
}

export const resetViewRegistry = (): void => {
  for (const id of Object.keys(views)) {
    delete views[id]
  }
  for (const uid of Object.keys(instances)) {
    delete instances[Number(uid)]
  }
  for (const uid of Object.keys(renderedDoms)) {
    delete renderedDoms[Number(uid)]
  }
}
