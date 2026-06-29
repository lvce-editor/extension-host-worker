import {
  activate as activateExtensionApi,
  executeSourceControlGetChangedFiles,
  registerCommand,
  registerSourceControlProvider,
} from '@lvce-editor/api'

const providerId = 'isolatedSourceControlError'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerSourceControlProvider({
    getChangedFiles() {
      throw new Error('isolated source control failed')
    },
    id: providerId,
  })
  registerCommand({
    execute() {
      return executeSourceControlGetChangedFiles(providerId)
    },
    id: 'isolatedSourceControlError.getChangedFiles',
  })
}

await activate()
