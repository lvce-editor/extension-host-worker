import { activate as activateExtensionApi, mkdir, registerCommand } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedFilesystem.mkdir',
    async execute(uri: string): Promise<void> {
      await mkdir(uri)
    },
  })
}

await activate()
