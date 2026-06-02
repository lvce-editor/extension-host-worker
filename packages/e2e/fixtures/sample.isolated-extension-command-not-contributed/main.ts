import { activate as activateExtensionApi, registerCommand } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedMissingContribution.run',
    execute(): void {},
  })
}

await activate()
