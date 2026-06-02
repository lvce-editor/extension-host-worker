import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

const provider = {
  id: 'isolatedHoverDuplicate',
  languageId: 'javascript',
  provideHover() {
    return {
      text: 'duplicate hover',
    }
  },
}

export const activate = (): void => {
  activateExtensionApi()
  registerHoverProvider(provider)
  registerHoverProvider(provider)
}
