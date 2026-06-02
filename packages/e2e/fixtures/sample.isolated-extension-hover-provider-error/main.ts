import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerHoverProvider({
    id: 'isolatedHoverError',
    languageId: 'javascript',
    provideHover() {
      throw new Error('isolated hover failed')
    },
  })
}
