import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerCompletionProvider({
    id: 'isolatedCompletionMissingContribution',
    languageId: 'javascript',
    provideCompletions() {
      return []
    },
  })
}
