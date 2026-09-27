import { activate as activateExtensionApi, confirm, registerCommand, showErrorMessage } from '@lvce-editor/api'

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedConfirmPromptSample',
    async execute(): Promise<void> {
      await showErrorMessage('WSL is not installed.', { title: 'WSL' })
      const confirmed = await confirm('Continue?', { cancelMessage: 'Cancel', confirmMessage: 'Continue', title: 'WSL' })
      await showErrorMessage(confirmed ? 'Confirmed' : 'Cancelled', { title: 'Confirmation result' })
    },
  })
}

await activate()
