import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const validateResult = (renameResult: any): string => {
  if (renameResult === null || renameResult === undefined) {
    return ''
  }
  if (typeof renameResult !== 'object') {
    return 'rename result must be of type object'
  }
  if (typeof renameResult.canRename !== 'boolean') {
    return `renameResult.canRename must be of type boolean`
  }
  if (!Array.isArray(renameResult.edits)) {
    return `renameResult.edits must be of type array`
  }
  for (const item of renameResult.edits) {
    if (!item) {
      return `renameResult item must be defined`
    }
    if (typeof item !== 'object') {
      return `renameResult item must be of type object`
    }
    if (typeof item.uri !== 'string') {
      return `renameResult item uri must be of type string`
    }
    if (!Array.isArray(item.edits)) {
      return `renameResult item edits must be of type array`
    }
  }
  return ''
}

const {
  executeprepareRenameProvider: executeLegacyPrepareRenameProvider,
  executeRenameProvider: executeLegacyRenameProvider,
  getProvider,
  registerRenameProvider,
  reset,
} = Registry.create({
  additionalMethodNames: [
    // @ts-ignore
    {
      methodName: 'prepareRename',
      name: 'prepareRename',
      resultShape: {
        allowUndefined: true,
        type: Types.Object,
      },
    },
  ],
  name: 'Rename',
  resultShape: validateResult,
})

export const executeRenameProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyRenameProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('rename', 'provideRename', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyRenameProvider, textDocumentId, args)
}

export const executeprepareRenameProvider = async (textDocumentId: number, ...args: readonly unknown[]): Promise<unknown> => {
  if (ExecuteIsolatedLanguageProvider.hasLegacyProvider(getProvider, textDocumentId)) {
    return ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyPrepareRenameProvider, textDocumentId, args)
  }
  const isolated = await ExecuteIsolatedLanguageProvider.execute('rename', 'prepareRename', textDocumentId, ...args)
  return isolated.found ? isolated.result : ExecuteIsolatedLanguageProvider.executeLegacy(executeLegacyPrepareRenameProvider, textDocumentId, args)
}

export { registerRenameProvider, reset }
import * as ExecuteIsolatedLanguageProvider from '../ExecuteIsolatedLanguageProvider/ExecuteIsolatedLanguageProvider.ts'
