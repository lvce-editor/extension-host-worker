import { activate as createActivation, registerStatusBarItemProvider } from '@lvce-editor/api'

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

export const activate = createActivation(() => {
  registerStatusBarItemProvider(statusBarProvider)
})
