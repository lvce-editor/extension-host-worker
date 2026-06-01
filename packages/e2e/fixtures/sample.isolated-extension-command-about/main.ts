import { activate as activateExtensionApi, executeCommand, registerCommand } from '@lvce-editor/api'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedAbout.openAbout',
    async execute(): Promise<void> {
      console.log('isolatedAbout.openAbout execute start')
      await executeCommand('About.showAbout')
      console.log('isolatedAbout.openAbout execute end')
    },
  })
}
