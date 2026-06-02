import { activate as activateExtensionApi, registerStatusBarItemProvider } from '@lvce-editor/api'

const statusBarProvider = {
  id: 'isolated-extension-api',
  getStatusBarItem() {
    return {
      text: 'isolated api',
      icon: '',
      name: 'isolated-extension-api',
      onClick: '',
    }
  },
}

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerStatusBarItemProvider(statusBarProvider)
}

await activate()
