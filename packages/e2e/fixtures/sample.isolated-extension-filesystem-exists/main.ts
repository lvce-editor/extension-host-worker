import { activate as activateExtensionApi, exists, registerCommand } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedFilesystem.exists',
    async execute(): Promise<boolean> {
      const fixtureFileUri = new URL('./sample.txt', import.meta.url).href
      return exists(fixtureFileUri)
    },
  })
}

await activate()
