import { activate as activateExtensionApi, executeCommand, registerCommand } from '@lvce-editor/api'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedAbout.openAbout',
    async execute(): Promise<void> {
      await executeCommand('About.showAbout')
    },
  })
}
