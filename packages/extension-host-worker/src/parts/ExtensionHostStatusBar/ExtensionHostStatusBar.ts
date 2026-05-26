import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostSourceControl from '../ExtensionHostSourceControl/ExtensionHostSourceControl.ts'

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
    if (provider && provider.getStatusBarItem) {
      const item = provider.getStatusBarItem()
      if (item) {
        statusBarItems.push(item)
      }
    }
  }
  return statusBarItems
}

export const registerChangeListener = () => {
  // TODO
}

export const executeCommand = async (name: string): Promise<void> => {
  await ExtensionHostCommand.executeCommand(name)
}

export interface StatusBarItemProvider {
  getStatusBarItem: () => any
  id: string
}

const providers: Record<string, StatusBarItemProvider> = Object.create(null)

export const executeStatusBarItemProvider = (id) => {
  const provider = providers[id]
  return provider.getStatusBarItem()
}

export const registerStatuBarItemProvider = (provider: StatusBarItemProvider) => {
  providers[provider.id] = provider
}
