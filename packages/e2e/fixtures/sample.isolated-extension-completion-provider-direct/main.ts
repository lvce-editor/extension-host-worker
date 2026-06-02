import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerCompletionProvider({
    id: 'isolatedCompletionDirect',
    languageId: 'javascript',
    provideCompletions(textDocument, offset) {
      return [
        {
          label: `${textDocument.text}:${offset}`,
          type: 1,
        },
      ]
    },
  })
}
