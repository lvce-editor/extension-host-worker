import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeDefinitionProvider: executeLegacyDefinitionProvider,
  getProvider,
  registerDefinitionProvider,
  reset,
} = Registry.create({
  name: 'Definition',
  resultShape: {
    allowUndefined: true,
    properties: {
      endOffset: {
        type: Types.Number,
      },
      startOffset: {
        type: Types.Number,
      },
      uri: {
        type: Types.String,
      },
    },
    type: Types.Object,
  },
})

export const executeDefinitionProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyDefinitionProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('definition', 'provideDefinition', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyDefinitionProvider, textDocumentId, args)
}

export { registerDefinitionProvider, reset }
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
