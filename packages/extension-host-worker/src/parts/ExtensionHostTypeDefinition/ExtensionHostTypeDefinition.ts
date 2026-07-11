import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeTypeDefinitionProvider: executeLegacyTypeDefinitionProvider,
  getProvider,
  registerTypeDefinitionProvider,
  reset,
} = Registry.create({
  name: 'TypeDefinition',
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

export const executeTypeDefinitionProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyTypeDefinitionProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('type definition', 'provideTypeDefinition', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyTypeDefinitionProvider, textDocumentId, args)
}

export { registerTypeDefinitionProvider, reset }
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
