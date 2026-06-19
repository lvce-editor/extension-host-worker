import { activate as activateExtensionApi, readDirWithFileTypes, registerCommand } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedFilesystem.readDirWithFileTypes',
    async execute(): Promise<readonly string[]> {
      const fixtureDirectoryUri = new URL('./', import.meta.url).href
      const dirents = await readDirWithFileTypes(fixtureDirectoryUri)
      return dirents.map((dirent) => dirent.name).sort()
    },
  })
}

await activate()
