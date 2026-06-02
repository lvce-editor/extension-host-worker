import { VError } from '../VError/VError.ts'

const state = {
  views: Object.create(null),
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

export const getRegisteredViewIds = (): readonly string[] => {
  return Object.values(state.views).map((view: any) => view.id)
}

export const reset = (): void => {
  state.views = Object.create(null)
}
