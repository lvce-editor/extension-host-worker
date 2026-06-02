import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

const provider = {
  id: 'isolatedCompletionDuplicate',
  languageId: 'javascript',
  provideCompletions() {
    return []
  },
}

export const activate = (): void => {
  activateExtensionApi()
  registerCompletionProvider(provider)
  registerCompletionProvider(provider)
}
