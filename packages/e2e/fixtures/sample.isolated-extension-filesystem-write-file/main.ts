import { activate as activateExtensionApi, registerCommand, writeFile } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedFilesystem.writeFile',
    async execute(uri: string, content: string): Promise<void> {
      await writeFile(uri, content)
    },
  })
}

await activate()
