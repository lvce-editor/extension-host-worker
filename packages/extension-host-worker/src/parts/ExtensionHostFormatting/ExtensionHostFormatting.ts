import { ExtensionApiError } from '../../../../extension-api/src/parts/ExtensionApiError/ExtensionApiError.ts'
import { executeFormattingProvider as executeIsolatedFormattingProvider } from '../../../../extension-api/src/parts/Formatting/Formatting.ts'
import { ensureError } from '../EnsureError/EnsureError.ts'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'
import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'
import { VError } from '../VError/VError.ts'

const {
  executeFormattingProvider: executeRegisteredFormattingProvider,
  getProvider,
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

const executeRegisteredFormattingProviderWithParams = executeRegisteredFormattingProvider as (textDocumentId: number, ...params: any[]) => Promise<any>

const executeFormattingProvider = async (textDocumentId: number, ...params: any[]) => {
  const textDocument = TextDocument.get(textDocumentId)
  if (!textDocument) {
    throw new VError(`Failed to execute formatting provider: textDocument with id ${textDocumentId} not found`)
  }
  const provider = getProvider(textDocument.languageId)
  if (provider) {
    return executeRegisteredFormattingProviderWithParams(textDocumentId, ...params)
  }
  try {
    return await executeIsolatedFormattingProvider(textDocument, ...params)
  } catch (error) {
    const actualError = ensureError(error)
    if (actualError instanceof ExtensionApiError) {
      throw new VError(actualError.message, 'Failed to execute formatting provider')
    }
    throw new VError(actualError, 'Failed to execute formatting provider')
  }
}

export { registerFormattingProvider, executeFormattingProvider, reset }
