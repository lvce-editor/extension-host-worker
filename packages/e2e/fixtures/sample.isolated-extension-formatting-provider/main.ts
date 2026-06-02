import { activate as activateExtensionApi, registerFormattingProvider } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerFormattingProvider({
    id: 'isolatedFormatting',
    languageId: 'javascript',
    format(textDocument) {
      return [
        {
          endOffset: textDocument.text.length,
          inserted: textDocument.text.replace('value=1', 'value = 1'),
          startOffset: 0,
        },
      ]
    },
  })
}

await activate()
