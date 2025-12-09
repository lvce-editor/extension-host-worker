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

export const getStatusBarItems2 = async () => {
  const providers = Object.values(ExtensionHostSourceControl.state.providers)
  const statusBarItems = []
  for (const provider of providers) {
    // @ts-ignore
    if (provider && provider.getStatusBarItems) {
      // @ts-ignore
      statusBarItems.push(...provider.getStatusBarItems())
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
