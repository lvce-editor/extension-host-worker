import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerHoverProvider({
    id: 'isolatedHoverMissingContribution',
    languageId: 'javascript',
    provideHover() {
      return {
        text: 'missing contribution',
      }
    },
  })
}
