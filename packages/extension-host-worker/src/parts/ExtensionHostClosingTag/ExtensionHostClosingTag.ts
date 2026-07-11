import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeClosingTagProvider: executeLegacyClosingTagProvider,
  getProvider,
  registerClosingTagProvider,
} = Registry.create({
  name: 'ClosingTag',
  resultShape: {
    allowUndefined: true,
    type: Types.Object,
  },
  returnUndefinedWhenNoProviderFound: true,
})

export const executeClosingTagProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyClosingTagProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('closing tag', 'provideClosingTag', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyClosingTagProvider, textDocumentId, args)
}

export { registerClosingTagProvider }
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
