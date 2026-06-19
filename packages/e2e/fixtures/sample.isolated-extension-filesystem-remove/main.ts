import { activate as activateExtensionApi, registerCommand, remove } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedFilesystem.remove',
    async execute(uri: string): Promise<void> {
      await remove(uri)
    },
  })
}

await activate()
