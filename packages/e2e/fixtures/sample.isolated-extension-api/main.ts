import { activate, registerStatusBarItemProvider } from '@lvce-editor/api'

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

const main = async (): Promise<void> => {
  await activate()
  registerStatusBarItemProvider(statusBarProvider)
}

main()
