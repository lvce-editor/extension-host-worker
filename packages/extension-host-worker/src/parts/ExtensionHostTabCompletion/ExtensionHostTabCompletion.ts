import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeTabCompletionProvider: executeLegacyTabCompletionProvider,
  getProvider,
  registerTabCompletionProvider,
  reset,
} = Registry.create({
  name: 'TabCompletion',
  resultShape: {
    allowUndefined: true,
    type: Types.Object,
  },
})

export const executeTabCompletionProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyTabCompletionProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('tab completion', 'provideTabCompletion', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyTabCompletionProvider, textDocumentId, args)
}

export { registerTabCompletionProvider, reset }
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
