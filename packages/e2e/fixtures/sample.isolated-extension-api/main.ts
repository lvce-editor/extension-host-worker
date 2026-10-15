import { activate as activateExtensionApi, path, registerStatusBarItemProvider } from '@lvce-editor/api'

await activateExtensionApi()
const greetingUri = path.join('file:///workspace/', 'greeting.txt')

const statusBarProvider = {
  id: 'isolated-extension-api',
  getStatusBarItem() {
    return {
      text: greetingUri,
      icon: '',
      name: 'isolated-extension-api',
      onClick: '',
    }
  },
}

registerStatusBarItemProvider(statusBarProvider)
