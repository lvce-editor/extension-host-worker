import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerCompletionProvider({
    id: 'isolatedCompletion',
    languageId: 'xyz',
    provideCompletions() {
      return [
        {
          label: 'isolatedResult',
          type: 1,
        },
      ]
    },
  })
}
