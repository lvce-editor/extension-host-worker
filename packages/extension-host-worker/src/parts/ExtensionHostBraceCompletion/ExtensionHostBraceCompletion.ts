import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeBraceCompletionProvider: executeLegacyBraceCompletionProvider,
  getProvider,
  registerBraceCompletionProvider,
  reset,
} = Registry.create({
  name: 'BraceCompletion',
  resultShape: {
    type: Types.Boolean,
  },
})

export const executeBraceCompletionProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyBraceCompletionProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('brace completion', 'provideBraceCompletion', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyBraceCompletionProvider, textDocumentId, args)
}

export { registerBraceCompletionProvider, reset }
