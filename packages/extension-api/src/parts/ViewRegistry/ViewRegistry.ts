import type { Disposable } from '../Disposable/Disposable.ts'
import type { RegisteredView, View, ViewRegistrySnapshot } from '../View/View.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const views: Record<string, View> = Object.create(null)

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
}

const toRegisteredView = (view: View): RegisteredView => {
  return {
    icon: view.icon,
    id: view.id,
    title: view.title,
  }
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

export const getViewRegistrySnapshot = (): ViewRegistrySnapshot => {
  return {
    views: Object.values(views).map(toRegisteredView),
  }
}

export const resetViewRegistry = (): void => {
  for (const id of Object.keys(views)) {
    delete views[id]
  }
}
