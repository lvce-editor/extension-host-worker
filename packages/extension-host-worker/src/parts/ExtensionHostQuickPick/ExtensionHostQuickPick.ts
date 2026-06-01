import { QuickPickWorker } from '@lvce-editor/rpc-registry'
import type { QuickInputOptions } from '../QuickInputOptions/QuickInputOptions.ts'
import type { QuickInputResult } from '../QuickInputResult/QuickInputResult.ts'
import * as Id from '../Id/Id.ts'

export interface QuickPickItem {
  readonly description: string
  readonly label: string
  readonly value: unknown
}

export interface ShowQuickPickOptions {
  readonly items: readonly QuickPickItem[]
  readonly placeholder?: string
}

const validateQuickPickItem = (item: QuickPickItem): void => {
  if (!item || typeof item !== 'object') {
    throw new TypeError('quick pick item must be an object')
  }
  if (typeof item.label !== 'string') {
    throw new TypeError('quick pick item.label must be a string')
  }
  if (typeof item.description !== 'string') {
    throw new TypeError('quick pick item.description must be a string')
  }
  if (!('value' in item)) {
    throw new TypeError('quick pick item.value is required')
  }
}

export const showQuickPick = async ({ items, placeholder }: ShowQuickPickOptions): Promise<unknown> => {
  if (!Array.isArray(items)) {
    throw new TypeError('showQuickPick items must be an array')
  }
  for (const item of items) {
    validateQuickPickItem(item)
  }
  return QuickPickWorker.invoke('QuickPick.showQuickPick', {
    items,
    placeholder,
  })
}

const quickInputs = Object.create(null)

export const renderQuickInput = async (id: number, searchValue: string): Promise<readonly unknown[]> => {
  const render = quickInputs[id]
  if (!render) {
    return []
  }
  return render(searchValue)
}

export const showQuickInput = async ({ ignoreFocusOut, initialValue, render }: QuickInputOptions): Promise<QuickInputResult> => {
  const id = Id.create()
  quickInputs[id] = render
  const initialItems = await render('')
  // TODO create direct connection to file search worker
  const { canceled, inputValue } = await QuickPickWorker.invoke('QuickPick.showQuickInput', {
    id,
    ignoreFocusOut,
    initialValue,
    initialItems,
  })
  try {
    return {
      canceled,
      inputValue,
    }
  } finally {
    delete quickInputs[id]
  }
}
