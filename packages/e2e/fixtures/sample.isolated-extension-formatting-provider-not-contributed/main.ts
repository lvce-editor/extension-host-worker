import { activate as activateExtensionApi, registerFormattingProvider } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerFormattingProvider({
    id: 'isolatedFormattingMissingContribution',
    languageId: 'javascript',
    format() {
      return []
    },
  })
}

await activate()
