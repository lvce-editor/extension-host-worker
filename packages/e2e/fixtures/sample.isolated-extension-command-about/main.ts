import { activate, executeCommand, registerCommand } from '@lvce-editor/api'

const main = async (): Promise<void> => {
  await activate()
  registerCommand({
    id: 'isolatedAbout.openAbout',
    async execute(): Promise<void> {
      await executeCommand('About.showAbout')
    },
  })
}

main()
