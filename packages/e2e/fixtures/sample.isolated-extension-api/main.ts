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

let registered = false

const main = async (): Promise<void> => {
  await activate()
  if (registered) {
    return
  }
  registered = true
  registerStatusBarItemProvider(statusBarProvider)
}

main()
