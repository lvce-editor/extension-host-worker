import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { diffTree, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { Disposable } from '../Disposable/Disposable.ts'
import type {
  DomEventListener,
  MenuEntry,
  RegisteredView,
  View,
  ViewAction,
  ViewContext,
  ViewEvent,
  ViewRegistrySnapshot,
  ViewRenderResult,
  ViewScrollPosition,
  ViewSelection,
  VirtualDomViewInstance,
} from '../View/View.ts'
import { registerCommand } from '../CommandRegistry/CommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const views: Record<string, View<any>> = Object.create(null)
const instances: Record<number, VirtualDomViewInstance> = Object.create(null)
const instanceUidsByView: Record<string, Set<number>> = Object.create(null)
const renderedDoms: Record<number, readonly VirtualDomNode[]> = Object.create(null)
const contexts: Record<number, Readonly<Record<string, boolean>>> = Object.create(null)
const contextViewIds: Record<number, string> = Object.create(null)
const viewCommandDisposables: Record<string, readonly Disposable[]> = Object.create(null)

interface ContextChange {
  readonly changed: boolean
  readonly newContext: Readonly<Record<string, boolean>>
  readonly oldContext: Readonly<Record<string, boolean>>
}

const assertBoolean = (value: unknown, message: string): void => {
  if (value !== undefined && typeof value !== 'boolean') {
    throw new ExtensionApiError(message)
  }
}

const assertNumber: (value: unknown, message: string) => asserts value is number = (value, message) => {
  if (typeof value !== 'number') {
    throw new ExtensionApiError(message)
  }
}

const assertString: (value: unknown, message: string) => asserts value is string = (value, message) => {
  if (typeof value !== 'string' || value.length === 0) {
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
  if (
    eventListener.trackPointerEvents !== undefined &&
    (!Array.isArray(eventListener.trackPointerEvents) ||
      eventListener.trackPointerEvents.some((event) => typeof event !== 'string' && typeof event !== 'number'))
  ) {
    throw new ExtensionApiError(`view ${viewId} event listener ${index} has invalid trackPointerEvents`)
  }
}

const assertEventListeners = (view: View<any>): void => {
  if (view.eventListeners === undefined) {
    return
  }
  if (!Array.isArray(view.eventListeners)) {
    throw new ExtensionApiError(`view ${view.id} eventListeners must be an array`)
  }
  for (const [index, listener] of view.eventListeners.entries()) {
    assertEventListener(view.id, listener, index)
  }
}

const assertCommands = (view: View<any>): void => {
  if (view.commands === undefined) {
    return
  }
  if (view.kind !== 'virtualDom') {
    throw new ExtensionApiError(`view ${view.id} commands require virtualDom kind`)
  }
  if (!view.commands || typeof view.commands !== 'object' || Array.isArray(view.commands)) {
    throw new ExtensionApiError(`view ${view.id} commands must be an object`)
  }
  for (const [id, command] of Object.entries(view.commands)) {
    assertString(id, `view ${view.id} command is missing id`)
    if (typeof command !== 'function') {
      throw new ExtensionApiError(`view ${view.id} command ${id} must be a function`)
    }
  }
}

const assertView = (view: View<any>): void => {
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
  assertCommands(view)
  assertEventListeners(view)
}

const toRegisteredView = (view: View<any>): RegisteredView => {
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

const getActiveViewInstance = (viewId: string): [number, VirtualDomViewInstance] | undefined => {
  const instanceUids = instanceUidsByView[viewId]
  if (!instanceUids) {
    return undefined
  }
  const uid = [...instanceUids].at(-1)
  if (uid === undefined) {
    return undefined
  }
  return [uid, instances[uid]]
}

const executeViewCommand = async (view: View<any>, commandId: string, args: readonly unknown[]): Promise<void> => {
  const activeInstance = getActiveViewInstance(view.id)
  if (!activeInstance) {
    return
  }
  const [uid, instance] = activeInstance
  const command = view.commands![commandId]
  const newInstance = await command(instance, ...args)
  assertVirtualDomViewInstance(view.id, newInstance)
  instances[uid] = newInstance
  await ExtensionManagementWorker.invoke('Extensions.requestViewRerender', uid)
}

const registerViewCommands = (view: View<any>): readonly Disposable[] => {
  const disposables: Disposable[] = []
  try {
    for (const id of Object.keys(view.commands || {})) {
      disposables.push(
        registerCommand({
          execute(...args: readonly unknown[]) {
            return executeViewCommand(view, id, args)
          },
          id,
        }),
      )
    }
  } catch (error) {
    for (const disposable of disposables) {
      disposable.dispose()
    }
    throw error
  }
  return disposables
}

export const registerView = <State>(view: View<State>): Disposable => {
  assertView(view)
  const commandDisposables = registerViewCommands(view)
  views[view.id] = view
  viewCommandDisposables[view.id] = commandDisposables
  return {
    dispose(): void {
      for (const disposable of commandDisposables) {
        disposable.dispose()
      }
      delete views[view.id]
      delete viewCommandDisposables[view.id]
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

const normalizeMenuEntry = (entry: unknown, index: number): MenuEntry => {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new ExtensionApiError(`menu entry ${index} must be an object`)
  }
  const menuEntry = entry as MenuEntry
  assertString(menuEntry.id, `menu entry ${index} is missing id`)
  assertString(menuEntry.label, `menu entry ${index} is missing label`)
  assertString(menuEntry.command, `menu entry ${index} is missing command`)
  if (menuEntry.flags !== undefined && typeof menuEntry.flags !== 'number') {
    throw new ExtensionApiError(`menu entry ${index} has invalid flags`)
  }
  if (menuEntry.args !== undefined && !Array.isArray(menuEntry.args)) {
    throw new ExtensionApiError(`menu entry ${index} has invalid args`)
  }
  return {
    command: menuEntry.command,
    flags: menuEntry.flags ?? 0,
    id: menuEntry.id,
    label: menuEntry.label,
    ...(menuEntry.args && { args: menuEntry.args }),
  }
}

const normalizeMenuEntries = (entries: unknown): readonly MenuEntry[] => {
  if (!Array.isArray(entries)) {
    throw new ExtensionApiError('view menu entries must be an array')
  }
  return entries.map(normalizeMenuEntry)
}

const normalizeViewAction = (action: unknown, index: number): ViewAction => {
  if (!action || typeof action !== 'object' || Array.isArray(action)) {
    throw new ExtensionApiError(`view action ${index} must be an object`)
  }
  const viewAction = action as ViewAction
  assertString(viewAction.title, `view action ${index} is missing title`)
  assertString(viewAction.icon, `view action ${index} is missing icon`)
  assertString(viewAction.command, `view action ${index} is missing command`)
  return {
    command: viewAction.command,
    icon: viewAction.icon,
    title: viewAction.title,
  }
}

const normalizeViewActions = (actions: unknown): readonly ViewAction[] => {
  if (!Array.isArray(actions)) {
    throw new ExtensionApiError('view actions must be an array')
  }
  return actions.map(normalizeViewAction)
}

const normalizeViewSelection = (selection: unknown, index: number): ViewSelection => {
  if (!selection || typeof selection !== 'object' || Array.isArray(selection)) {
    throw new ExtensionApiError(`view selection ${index} must be an object`)
  }
  const viewSelection = selection as ViewSelection
  assertString(viewSelection.name, `view selection ${index} is missing name`)
  assertNumber(viewSelection.start, `view selection ${index} is missing start`)
  assertNumber(viewSelection.end, `view selection ${index} is missing end`)
  return {
    end: viewSelection.end,
    name: viewSelection.name,
    start: viewSelection.start,
  }
}

const normalizeViewSelections = (selections: unknown): readonly ViewSelection[] => {
  if (!Array.isArray(selections)) {
    throw new ExtensionApiError('view selections must be an array')
  }
  return selections.map(normalizeViewSelection)
}

const normalizeViewScrollPosition = (scrollPosition: unknown): readonly [] | ViewScrollPosition => {
  if (!Array.isArray(scrollPosition)) {
    throw new ExtensionApiError('view scroll position must be an array')
  }
  if (scrollPosition.length === 0) {
    return []
  }
  if (scrollPosition.length !== 2) {
    throw new ExtensionApiError('view scroll position must contain a selector and scroll top')
  }
  assertString(scrollPosition[0], 'view scroll position is missing selector')
  assertNumber(scrollPosition[1], 'view scroll position is missing scroll top')
  return [scrollPosition[0], scrollPosition[1]]
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

const normalizeContext = (context: unknown): Readonly<Record<string, boolean>> => {
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return {}
  }
  const normalized: Record<string, boolean> = {}
  for (const [key, value] of Object.entries(context)) {
    if (typeof value === 'boolean') {
      normalized[key] = value
    }
  }
  return normalized
}

const isSameContext = (oldContext: Readonly<Record<string, boolean>>, newContext: Readonly<Record<string, boolean>>): boolean => {
  const oldKeys = Object.keys(oldContext)
  const newKeys = Object.keys(newContext)
  if (oldKeys.length !== newKeys.length) {
    return false
  }
  for (const key of oldKeys) {
    if (oldContext[key] !== newContext[key]) {
      return false
    }
  }
  return true
}

const unchangedContext: ContextChange = {
  changed: false,
  newContext: {},
  oldContext: {},
}

const maybeNotifyContextChanged = async (uid: number, viewId: string, instance: VirtualDomViewInstance): Promise<ContextChange> => {
  if (typeof instance.getContext !== 'function') {
    return unchangedContext
  }
  const oldContext = contexts[uid] || {}
  const newContext = normalizeContext(instance.getContext())
  if (isSameContext(oldContext, newContext)) {
    return {
      changed: false,
      newContext,
      oldContext,
    }
  }
  if (Object.keys(newContext).length === 0) {
    delete contexts[uid]
  } else {
    contexts[uid] = newContext
  }
  await ExtensionManagementWorker.invoke('Extensions.handleViewContextChange', uid, viewId, newContext)
  return {
    changed: true,
    newContext,
    oldContext,
  }
}

const renderFocus = async (instance: VirtualDomViewInstance, contextChange: ContextChange): Promise<string> => {
  if (!contextChange.changed || typeof instance.renderFocus !== 'function') {
    return ''
  }
  const focusSelector = await instance.renderFocus(contextChange.oldContext, contextChange.newContext)
  if (typeof focusSelector !== 'string') {
    throw new ExtensionApiError('view renderFocus result must be a string')
  }
  return focusSelector
}

const withFocusSelector = async (
  result: ViewRenderResult,
  instance: VirtualDomViewInstance,
  contextChange: ContextChange,
): Promise<ViewRenderResult> => {
  const focusSelector = await renderFocus(instance, contextChange)
  if (!focusSelector) {
    return result
  }
  return {
    ...result,
    focusSelector,
  }
}

const withTitle = async (result: ViewRenderResult, instance: VirtualDomViewInstance): Promise<ViewRenderResult> => {
  if (typeof instance.renderTitle !== 'function') {
    return result
  }
  const title = await instance.renderTitle()
  if (typeof title !== 'string') {
    throw new ExtensionApiError('view renderTitle result must be a string')
  }
  return {
    ...result,
    title,
  }
}

const withSelections = async (result: ViewRenderResult, instance: VirtualDomViewInstance): Promise<ViewRenderResult> => {
  if (typeof instance.renderSelections !== 'function') {
    return result
  }
  const selections = normalizeViewSelections(await instance.renderSelections())
  if (selections.length === 0) {
    return result
  }
  return {
    ...result,
    selections,
  }
}

const withScrollPosition = async (result: ViewRenderResult, instance: VirtualDomViewInstance): Promise<ViewRenderResult> => {
  if (typeof instance.renderScrollPosition !== 'function') {
    return result
  }
  const scrollPosition = normalizeViewScrollPosition(await instance.renderScrollPosition())
  if (scrollPosition.length === 0) {
    return result
  }
  return {
    ...result,
    scrollPosition,
  }
}

const withRenderMetadata = async (
  result: ViewRenderResult,
  instance: VirtualDomViewInstance,
  contextChange: ContextChange,
): Promise<ViewRenderResult> => {
  const resultWithFocus = await withFocusSelector(result, instance, contextChange)
  const resultWithSelections = await withSelections(resultWithFocus, instance)
  const resultWithScrollPosition = await withScrollPosition(resultWithSelections, instance)
  return withTitle(resultWithScrollPosition, instance)
}

const maybeClearContext = async (uid: number, viewId: string): Promise<void> => {
  if (!contexts[uid]) {
    return
  }
  delete contexts[uid]
  await ExtensionManagementWorker.invoke('Extensions.handleViewContextChange', uid, viewId, {})
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
    showContextMenu(menuId: string, x: number, y: number) {
      assertString(menuId, 'menuId must be a string')
      assertNumber(x, 'x must be a number')
      assertNumber(y, 'y must be a number')
      return ExtensionManagementWorker.invoke('Extensions.showViewContextMenu', uid, viewId, menuId, x, y) as Promise<void>
    },
    uid,
    viewId,
  })
  assertVirtualDomViewInstance(viewId, instance)
  instances[uid] = instance
  const instanceUids = instanceUidsByView[viewId] || new Set<number>()
  instanceUids.add(uid)
  instanceUidsByView[viewId] = instanceUids
  contextViewIds[uid] = viewId
  const dom = await renderDom(instance)
  renderedDoms[uid] = dom
  const result: ViewRenderResult = {
    dom,
    type: 'setDom',
  }
  const contextChange = await maybeNotifyContextChanged(uid, viewId, instance)
  return withRenderMetadata(result, instance, contextChange)
}

export const dispatchViewEvent = async (uid: number, event: ViewEvent): Promise<ViewRenderResult> => {
  const instance = getVirtualDomInstance(uid)
  const instanceUids = instanceUidsByView[contextViewIds[uid]]
  instanceUids.delete(uid)
  instanceUids.add(uid)
  if (typeof instance.handleEvent === 'function') {
    await instance.handleEvent(event)
  }
  const result = await renderPatches(uid, instance)
  const contextChange = await maybeNotifyContextChanged(uid, contextViewIds[uid], instance)
  return withRenderMetadata(result, instance, contextChange)
}

export const renderViewInstance = async (uid: number): Promise<ViewRenderResult> => {
  const instance = getVirtualDomInstance(uid)
  const result = await renderPatches(uid, instance)
  const contextChange = await maybeNotifyContextChanged(uid, contextViewIds[uid], instance)
  return withRenderMetadata(result, instance, contextChange)
}

export const disposeViewInstance = async (uid: number): Promise<void> => {
  const instance = instances[uid]
  if (instance && typeof instance.dispose === 'function') {
    await instance.dispose()
  }
  await maybeClearContext(uid, contextViewIds[uid])
  const viewId = contextViewIds[uid]
  const instanceUids = instanceUidsByView[viewId]
  instanceUids?.delete(uid)
  if (instanceUids?.size === 0) {
    delete instanceUidsByView[viewId]
  }
  delete instances[uid]
  delete renderedDoms[uid]
  delete contextViewIds[uid]
}

export const saveViewInstanceState = async (uid: number): Promise<unknown> => {
  const instance = getVirtualDomInstance(uid)
  if (typeof instance.saveState !== 'function') {
    return undefined
  }
  return instance.saveState()
}

export const getViewMenuEntries = async (uid: number, menuId: string): Promise<readonly MenuEntry[]> => {
  assertString(menuId, 'menuId must be a string')
  const instance = getVirtualDomInstance(uid)
  if (typeof instance.getMenuEntries !== 'function') {
    return []
  }
  return normalizeMenuEntries(await instance.getMenuEntries(menuId))
}

export const getViewActions = async (uid: number): Promise<readonly ViewAction[]> => {
  const instance = getVirtualDomInstance(uid)
  if (typeof instance.renderActions !== 'function') {
    return []
  }
  return normalizeViewActions(await instance.renderActions())
}

export const getViewRegistrySnapshot = (): ViewRegistrySnapshot => {
  return {
    views: Object.values(views).map(toRegisteredView),
  }
}

export const resetViewRegistry = (): void => {
  for (const id of Object.keys(views)) {
    for (const disposable of viewCommandDisposables[id] || []) {
      disposable.dispose()
    }
    delete views[id]
    delete viewCommandDisposables[id]
  }
  for (const uid of Object.keys(instances)) {
    delete instances[Number(uid)]
  }
  for (const uid of Object.keys(renderedDoms)) {
    delete renderedDoms[Number(uid)]
  }
  for (const uid of Object.keys(contexts)) {
    delete contexts[Number(uid)]
  }
  for (const uid of Object.keys(contextViewIds)) {
    delete contextViewIds[Number(uid)]
  }
  for (const viewId of Object.keys(instanceUidsByView)) {
    delete instanceUidsByView[viewId]
  }
}
