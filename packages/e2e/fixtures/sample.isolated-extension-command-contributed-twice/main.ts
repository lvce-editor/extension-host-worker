import { activate as activateExtensionApi, registerCommand } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedDuplicate.run',
    execute(): void {},
  })
}

await activate()
