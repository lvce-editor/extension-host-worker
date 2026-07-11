import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const {
  executefileReferenceProvider: executeLegacyFileReferenceProvider,
  executeReferenceProvider: executeLegacyReferenceProvider,
  getProvider,
  registerReferenceProvider,
  reset,
} = Registry.create({
  additionalMethodNames: [
    // @ts-ignore
    {
      methodName: 'provideFileReferences',
      name: 'fileReference',
      resultShape: {
        items: {
          type: Types.Object,
        },
        type: Types.Array,
      },
    },
  ],
  name: 'Reference',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

export const executeReferenceProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyReferenceProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('reference', 'provideReferences', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyReferenceProvider, textDocumentId, args)
}

export const executefileReferenceProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyFileReferenceProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('reference', 'provideFileReferences', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyFileReferenceProvider, textDocumentId, args)
}

export { registerReferenceProvider, reset }

export const executeReferenceProvider2 = async (uri: string, languageId: string, offset: number, position: any): Promise<unknown> => {
  const provider = getProvider(languageId)
  if (provider) {
    return provider.provideReferences2({
      offset,
      position,
      uri,
    })
  }
  const isolated = await ExecuteIsolatedLanguageProvider.executeWithTextDocument(
    'reference',
    'provideReferences2',
    { languageId, uri },
    { offset, position, uri },
  )
  if (isolated.found) {
    return isolated.result
  }
  return undefined
}
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
