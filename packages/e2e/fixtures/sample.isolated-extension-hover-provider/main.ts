import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerHoverProvider({
    id: 'isolatedHover',
    languageId: 'xyz',
    provideHover() {
      return {
        text: 'isolated hover result',
      }
    },
  })
}
