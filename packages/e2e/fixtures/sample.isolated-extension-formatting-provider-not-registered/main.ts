import { activate as activateExtensionApi } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
}

await activate()
