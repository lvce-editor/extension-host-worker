import { activate as activateExtensionApi, readFile, registerCommand } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedFilesystem.readFile',
    async execute(): Promise<string> {
      const fixtureFileUri = new URL('./sample.txt', import.meta.url).href
      return readFile(fixtureFileUri)
    },
  })
}

await activate()
