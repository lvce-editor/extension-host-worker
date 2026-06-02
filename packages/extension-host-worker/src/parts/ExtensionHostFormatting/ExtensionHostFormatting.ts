import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'
import { VError } from '../VError/VError.ts'

const {
  executeFormattingProvider: executeRegisteredFormattingProvider,
  getProvider,
  getProviders,
  registerFormattingProvider,
  reset,
} = Registry.create({
  executeKey: 'format',
  name: 'Formatting',
  resultShape: {
    allowUndefined: true,
    items: {
      properties: {
        endOffset: {
          type: Types.Number,
        },
        inserted: {
          type: Types.String,
        },
        startOffset: {
          type: Types.Number,
        },
      },
      type: Types.Object,
    },
    type: Types.Array,
  },
})

const executeRegisteredFormattingProviderWithParams = executeRegisteredFormattingProvider as (
  textDocumentId: number,
  ...params: any[]
) => Promise<any>

const executeFormattingProvider = async (textDocumentId: number, ...params: any[]) => {
  const textDocument = TextDocument.get(textDocumentId)
  if (!textDocument) {
    throw new VError(`Failed to execute formatting provider: textDocument with id ${textDocumentId} not found`)
  }
  const provider = getProvider(textDocument.languageId)
  if (!provider) {
    throw new VError(`No formatting provider found for ${textDocument.languageId}`, 'Failed to execute formatting provider')
  }
  return executeRegisteredFormattingProviderWithParams(textDocumentId, ...params)
}

const getRegisteredFormattingProviderIds = (): readonly string[] => {
  return getProviders().map((provider: any) => provider.id)
}

export { registerFormattingProvider, executeFormattingProvider, getRegisteredFormattingProviderIds, reset }
