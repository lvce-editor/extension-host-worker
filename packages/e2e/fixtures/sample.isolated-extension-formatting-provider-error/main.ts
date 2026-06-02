import { activate as activateExtensionApi, registerFormattingProvider } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerFormattingProvider({
    id: 'isolatedFormattingError',
    languageId: 'javascript',
    format() {
      throw new Error('isolated formatting failed')
    },
  })
}

await activate()
