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

const { executeprepareRenameProvider, executeRenameProvider, registerRenameProvider, reset } = Registry.create({
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

export { registerRenameProvider, executeRenameProvider, executeprepareRenameProvider, reset }
