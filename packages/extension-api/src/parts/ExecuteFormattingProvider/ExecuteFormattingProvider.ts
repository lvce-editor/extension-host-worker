import type { FormattingEdit } from '../FormattingEdit/FormattingEdit.ts'
import type { TextDocument } from '../FormattingProvider/FormattingProvider.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { getFormattingProviderByLanguageId } from '../FormattingProviderState/FormattingProviderState.ts'

export const executeFormattingProvider = async (textDocument: TextDocument, ...args: readonly unknown[]): Promise<readonly FormattingEdit[]> => {
  const provider = getFormattingProviderByLanguageId(textDocument.languageId)
  if (!provider) {
    throw new ExtensionApiError(`No formatting provider found for ${textDocument.languageId}`)
  }
  return provider.format(textDocument, ...args)
}
