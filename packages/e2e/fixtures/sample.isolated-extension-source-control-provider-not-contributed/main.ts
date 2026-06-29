import { activate as activateExtensionApi, registerCommand, registerSourceControlProvider } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerSourceControlProvider({
    getChangedFiles() {
      return []
    },
    id: 'isolatedSourceControlMissingContribution',
  })
  registerCommand({
    execute() {
      throw new Error('source control provider isolatedSourceControlMissingContribution is registered but not contributed in extension.json')
    },
    id: 'isolatedSourceControlMissingContribution.activate',
  })
}

await activate()
