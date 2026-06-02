import { activate as activateExtensionApi, registerFormattingProvider } from '@lvce-editor/api'

const provider = {
  id: 'isolatedFormattingDuplicate',
  languageId: 'javascript',
  format() {
    return []
  },
}

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerFormattingProvider(provider)
  registerFormattingProvider(provider)
}

await activate()
