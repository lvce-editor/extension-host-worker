import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeSelectionProvider: executeLegacySelectionProvider,
  getProvider,
  registerSelectionProvider,
  reset,
} = Registry.create({
  name: 'Selection',
  resultShape: {
    allowUndefined: true,
    items: {
      type: 'number',
    },
    type: Types.Array,
  },
})

export const executeSelectionProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacySelectionProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('selection', 'provideSelections', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacySelectionProvider, textDocumentId, args)
}

export { registerSelectionProvider, reset }
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
