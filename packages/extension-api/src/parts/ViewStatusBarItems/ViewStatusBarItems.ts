import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemProviderHandle } from '../StatusBarItemProviderHandle/StatusBarItemProviderHandle.ts'
import type { VirtualDomViewInstance } from '../View/View.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { registerStatusBarItemProvider } from '../StatusBarItemProviderRegistry/StatusBarItemProviderRegistry.ts'

const handlesByUid: Record<number, readonly StatusBarItemProviderHandle[]> = Object.create(null)
const itemsByUid: Record<number, readonly StatusBarItem[]> = Object.create(null)

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

const disposeHandles = (uid: number): void => {
  for (const handle of handlesByUid[uid] || []) {
    handle.dispose()
  }
  delete handlesByUid[uid]
}

const replaceItems = (uid: number, viewId: string, items: readonly StatusBarItem[]): void => {
  disposeHandles(uid)
  itemsByUid[uid] = items
  handlesByUid[uid] = items.map((_item, index) =>
    registerStatusBarItemProvider({
      getStatusBarItem() {
        return itemsByUid[uid]?.[index]
      },
      id: `view:${viewId}:${uid}:${index}`,
    }),
  )
}

export const renderViewStatusBarItems = async (uid: number, viewId: string, instance: VirtualDomViewInstance): Promise<void> => {
  if (typeof instance.renderStatusBarItems !== 'function') {
    return
  }
  const items = normalizeStatusBarItems(await instance.renderStatusBarItems())
  const oldItems = itemsByUid[uid] || []
  if (areItemsEqual(oldItems, items)) {
    return
  }
  if ((handlesByUid[uid]?.length || 0) !== items.length) {
    replaceItems(uid, viewId, items)
    return
  }
  itemsByUid[uid] = items
  await Promise.all((handlesByUid[uid] || []).map((handle) => handle.refresh()))
}

export const disposeViewStatusBarItems = (uid: number): void => {
  disposeHandles(uid)
  delete itemsByUid[uid]
}

export const resetViewStatusBarItems = (): void => {
  for (const uid of Object.keys(itemsByUid)) {
    disposeViewStatusBarItems(Number(uid))
  }
}
