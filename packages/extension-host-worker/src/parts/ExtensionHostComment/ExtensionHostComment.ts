import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
import * as Registry from '../Registry/Registry.ts'

const {
  executeCommentProvider: executeLegacyCommentProvider,
  getProvider,
  registerCommentProvider,
} = Registry.create({
  name: 'Comment',
  resultShape() {
    return ''
  },
})

export const executeCommentProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyCommentProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('comment', 'provideComment', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyCommentProvider, textDocumentId, args)
}

export { registerCommentProvider }
