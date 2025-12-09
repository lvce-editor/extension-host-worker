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
  console.log({ providers })
  for (const provider of providers) {
    // @ts-ignore
    if (provider && provider.getStatusBarItems) {
      // @ts-ignore
      statusBarItems.push(...provider.getStatusBarItems())
    }
  }
  console.log({ statusBarItems })
  return statusBarItems
}

export const registerChangeListener = () => {
  // TODO
}
