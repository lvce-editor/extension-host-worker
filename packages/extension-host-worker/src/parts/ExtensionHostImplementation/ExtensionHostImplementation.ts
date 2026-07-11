import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executeImplementationProvider: executeLegacyImplementationProvider,
  getProvider,
  registerImplementationProvider,
  reset,
} = Registry.create({
  name: 'Implementation',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

export const executeImplementationProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyImplementationProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('implementation', 'provideImplementations', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyImplementationProvider, textDocumentId, args)
}

export { registerImplementationProvider, reset }
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
