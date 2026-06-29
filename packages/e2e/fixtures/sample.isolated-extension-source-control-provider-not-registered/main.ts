import { activate as activateExtensionApi, registerCommand } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    execute() {
      throw new Error('source control provider isolatedSourceControlMissingRegistration is contributed in extension.json but not registered')
    },
    id: 'isolatedSourceControlMissingRegistration.activate',
  })
}

await activate()
