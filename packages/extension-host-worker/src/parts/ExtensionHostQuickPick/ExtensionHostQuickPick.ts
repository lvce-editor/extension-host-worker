import { QuickPickWorker } from '@lvce-editor/rpc-registry'

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
