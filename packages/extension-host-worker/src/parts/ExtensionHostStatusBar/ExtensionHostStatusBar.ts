import { getStatusBarItems as getExtensionApiStatusBarItems } from '../../../../extension-api/src/parts/GetStatusBarItems/GetStatusBarItems.ts'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import { VError } from '../VError/VError.ts'

export const getStatusBarItems = async () => {
  const providers = Object.values(ExtensionHostSourceControl.state.providers)
  const statusBarItems = []
  for (const provider of providers) {
    // @ts-ignore
    if (provider && provider.statusBarCommands) {
      // @ts-ignore
      statusBarItems.push(...provider.statusBarCommands)
    }
  }
  return statusBarItems
}

export const getStatusBarItems2 = async (): Promise<any[]> => {
  const sourceProviders = Object.values(ExtensionHostSourceControl.state.providers)
  const statusBarItems: any[] = []
  for (const provider of sourceProviders) {
    // @ts-ignore
    if (provider && provider.getStatusBarItems) {
      // @ts-ignore
      statusBarItems.push(...provider.getStatusBarItems())
    }
  }
  const values = Object.values(providers)
  for (const provider of values) {
    if (provider) {
      const item = getValidatedStatusBarItem(provider)
      if (item) {
        statusBarItems.push(item)
      }
    }
  }
  statusBarItems.push(...getExtensionApiStatusBarItems())
  return statusBarItems
}

export const registerChangeListener = () => {
  // TODO
}

export const executeCommand = async (name: string): Promise<void> => {
  await ExtensionHostCommand.executeCommand(name)
}

export interface StatusBarItemProvider {
  readonly getStatusBarItem: () => any
  readonly id: string
}

export interface StatusBarItemProviderHandle {
  readonly refresh: () => Promise<void>
}

const providers: Record<string, StatusBarItemProvider> = Object.create(null)

const getStatusBarItemProviderDisplay = (provider: StatusBarItemProvider): string => {
  if (provider && provider.id && typeof provider.id === 'string') {
    return ` ${provider.id}`
  }
  return ''
}

const notifyChange = async (id: string): Promise<void> => {
  await Rpc.invoke('StatusBar.handleChange', id)
}

const getType = (value: any): string => {
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  return typeof value
}

const validateStatusBarItem = (item: any): void => {
  if (!item || typeof item !== 'object') {
    throw new Error(`status bar item must be an object, got ${getType(item)}`)
  }
  if ('text' in item && typeof item.text !== 'string') {
    throw new Error(`status bar item.text must be a string, got ${getType(item.text)}`)
  }
  if ('name' in item && typeof item.name !== 'string') {
    throw new Error(`status bar item.name must be a string, got ${getType(item.name)}`)
  }
}

const getErrorStatusBarItem = (title: string) => {
  return {
    icon: '',
    name: 'error',
    onClick: '',
    text: 'error',
    title,
  }
}

const getValidatedStatusBarItem = (provider: StatusBarItemProvider): any => {
  try {
    const item = provider.getStatusBarItem()
    if (!item) {
      return item
    }
    validateStatusBarItem(item)
    return item
  } catch (error) {
    const providerDisplay = getStatusBarItemProviderDisplay(provider)
    const wrappedError = new VError(error, `Failed to execute status bar item provider${providerDisplay}`)
    console.error(wrappedError)
    return getErrorStatusBarItem(wrappedError.message)
  }
}

export const executeStatusBarItemProvider = (id) => {
  const provider = providers[id]
  return getValidatedStatusBarItem(provider)
}

export const registerStatuBarItemProvider = (provider: StatusBarItemProvider): StatusBarItemProviderHandle => {
  try {
    if (!provider.id) {
      throw new Error('status bar item provider is missing id')
    }
    if (provider.id in providers) {
      throw new Error('status bar item provider cannot be registered multiple times')
    }
    providers[provider.id] = provider
    return {
      refresh() {
        return notifyChange(provider.id)
      },
    }
  } catch (error) {
    const providerDisplay = getStatusBarItemProviderDisplay(provider)
    throw new VError(error, `Failed to register status bar item provider${providerDisplay}`)
  }
}

export const reset = (): void => {
  for (const key of Object.keys(providers)) {
    delete providers[key]
  }
}
