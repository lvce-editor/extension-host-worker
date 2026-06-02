import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerCompletionProvider({
    id: 'isolatedCompletionInvalidResult',
    languageId: 'javascript',
    provideCompletions() {
      return 42 as any
    },
  })
}
