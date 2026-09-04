import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemProviderHandle } from '../StatusBarItemProviderHandle/StatusBarItemProviderHandle.ts'
import type { VirtualDomViewInstance } from '../View/View.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { registerStatusBarItemProvider } from '../StatusBarItemProviderRegistry/StatusBarItemProviderRegistry.ts'

const activeUidByViewId: Record<string, number> = Object.create(null)
const explicitActiveStateByUid: Record<number, boolean> = Object.create(null)
const handlesByViewId: Record<string, readonly StatusBarItemProviderHandle[]> = Object.create(null)
const itemsByUid: Record<number, readonly StatusBarItem[]> = Object.create(null)
const renderedUidsByViewId: Record<string, number[]> = Object.create(null)
const viewIdByUid: Record<number, string> = Object.create(null)

const stringProperties = ['ariaLabel', 'icon', 'name', 'onClick', 'text', 'title'] as const

const normalizeStatusBarItem = (item: unknown, index: number): StatusBarItem => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new ExtensionApiError(`view status bar item ${index} must be an object`)
  }
  const statusBarItem = item as StatusBarItem
  for (const property of stringProperties) {
    if (statusBarItem[property] !== undefined && typeof statusBarItem[property] !== 'string') {
      throw new ExtensionApiError(`view status bar item ${index} has invalid ${property}`)
    }
  }
  if (statusBarItem.spinning !== undefined && typeof statusBarItem.spinning !== 'boolean') {
    throw new ExtensionApiError(`view status bar item ${index} has invalid spinning`)
  }
  return {
    ...(statusBarItem.ariaLabel !== undefined && { ariaLabel: statusBarItem.ariaLabel }),
    ...(statusBarItem.icon !== undefined && { icon: statusBarItem.icon }),
    ...(statusBarItem.name !== undefined && { name: statusBarItem.name }),
    ...(statusBarItem.onClick !== undefined && { onClick: statusBarItem.onClick }),
    ...(statusBarItem.spinning !== undefined && { spinning: statusBarItem.spinning }),
    ...(statusBarItem.text !== undefined && { text: statusBarItem.text }),
    ...(statusBarItem.title !== undefined && { title: statusBarItem.title }),
  }
}

const normalizeStatusBarItems = (items: unknown): readonly StatusBarItem[] => {
  if (!Array.isArray(items)) {
    throw new ExtensionApiError('view renderStatusBarItems result must be an array')
  }
  return items.map(normalizeStatusBarItem)
}

const areItemsEqual = (oldItems: readonly StatusBarItem[], newItems: readonly StatusBarItem[]): boolean => {
  if (oldItems.length !== newItems.length) {
    return false
  }
  return oldItems.every((oldItem, index) => {
    const newItem = newItems[index]
    return (
      oldItem.ariaLabel === newItem.ariaLabel &&
      oldItem.icon === newItem.icon &&
      oldItem.name === newItem.name &&
      oldItem.onClick === newItem.onClick &&
      oldItem.spinning === newItem.spinning &&
      oldItem.text === newItem.text &&
      oldItem.title === newItem.title
    )
  })
}

const disposeHandles = async (viewId: string): Promise<void> => {
  const handles = handlesByViewId[viewId] || []
  delete handlesByViewId[viewId]
  await Promise.all(handles.map((handle) => handle.dispose()))
}

const replaceItems = async (viewId: string, itemCount: number): Promise<void> => {
  await disposeHandles(viewId)
  handlesByViewId[viewId] = Array.from({ length: itemCount }, (_item, index) =>
    registerStatusBarItemProvider({
      getStatusBarItem() {
        return itemsByUid[activeUidByViewId[viewId]]?.[index]
      },
      id: `view:${viewId}:${index}`,
    }),
  )
}

const refreshItems = async (viewId: string): Promise<void> => {
  await Promise.all((handlesByViewId[viewId] || []).map((handle) => handle.refresh()))
}

const setActiveUid = (viewId: string, uid: number): void => {
  const renderedUids = renderedUidsByViewId[viewId] || []
  const index = renderedUids.indexOf(uid)
  if (index !== -1) {
    renderedUids.splice(index, 1)
  }
  renderedUids.push(uid)
  renderedUidsByViewId[viewId] = renderedUids
  activeUidByViewId[viewId] = uid
}

export const renderViewStatusBarItems = async (uid: number, viewId: string, instance: VirtualDomViewInstance): Promise<void> => {
  if (typeof instance.renderStatusBarItems !== 'function') {
    return
  }
  const items = normalizeStatusBarItems(await instance.renderStatusBarItems())
  const oldItems = itemsByUid[uid] || []
  const wasActive = activeUidByViewId[viewId] === uid
  itemsByUid[uid] = items
  viewIdByUid[uid] = viewId
  if (explicitActiveStateByUid[uid] !== undefined && !explicitActiveStateByUid[uid]) {
    return
  }
  setActiveUid(viewId, uid)
  if (wasActive && areItemsEqual(oldItems, items)) {
    return
  }
  if ((handlesByViewId[viewId]?.length || 0) !== items.length) {
    await replaceItems(viewId, items.length)
    return
  }
  await refreshItems(viewId)
}

export const setViewInstanceActive = async (uid: number, active: boolean): Promise<void> => {
  const viewId = viewIdByUid[uid]
  if (!viewId) {
    return
  }
  explicitActiveStateByUid[uid] = active
  if (!active) {
    if (activeUidByViewId[viewId] !== uid) {
      return
    }
    delete activeUidByViewId[viewId]
    await disposeHandles(viewId)
    return
  }
  const wasActive = activeUidByViewId[viewId] === uid
  const items = itemsByUid[uid] || []
  setActiveUid(viewId, uid)
  if (wasActive && (handlesByViewId[viewId]?.length || 0) === items.length) {
    return
  }
  if ((handlesByViewId[viewId]?.length || 0) !== items.length) {
    await replaceItems(viewId, items.length)
    return
  }
  await refreshItems(viewId)
}

export const disposeViewStatusBarItems = async (uid: number): Promise<void> => {
  const viewId = viewIdByUid[uid]
  if (!viewId) {
    return
  }
  delete itemsByUid[uid]
  delete explicitActiveStateByUid[uid]
  delete viewIdByUid[uid]
  const renderedUids = renderedUidsByViewId[viewId] || []
  const remainingUids = renderedUids.filter((renderedUid) => renderedUid !== uid)
  if (remainingUids.length === 0) {
    delete activeUidByViewId[viewId]
    delete renderedUidsByViewId[viewId]
    await disposeHandles(viewId)
    return
  }
  renderedUidsByViewId[viewId] = remainingUids
  if (activeUidByViewId[viewId] !== uid) {
    return
  }
  const activeUid = remainingUids.at(-1)!
  const items = itemsByUid[activeUid] || []
  activeUidByViewId[viewId] = activeUid
  if ((handlesByViewId[viewId]?.length || 0) !== items.length) {
    await replaceItems(viewId, items.length)
    return
  }
  await refreshItems(viewId)
}

export const resetViewStatusBarItems = (): void => {
  for (const viewId of Object.keys(handlesByViewId)) {
    void disposeHandles(viewId)
  }
  for (const uid of Object.keys(itemsByUid)) {
    delete itemsByUid[Number(uid)]
    delete explicitActiveStateByUid[Number(uid)]
    delete viewIdByUid[Number(uid)]
  }
  for (const viewId of Object.keys(activeUidByViewId)) {
    delete activeUidByViewId[viewId]
    delete renderedUidsByViewId[viewId]
  }
}
