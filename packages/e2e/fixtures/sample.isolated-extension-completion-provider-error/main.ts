import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerCompletionProvider({
    id: 'isolatedCompletionError',
    languageId: 'javascript',
    provideCompletions() {
      throw new Error('isolated completion failed')
    },
  })
}
