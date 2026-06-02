import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerHoverProvider({
    id: 'isolatedHoverInvalidResult',
    languageId: 'javascript',
    provideHover() {
      return 'invalid hover' as any
    },
  })
}
