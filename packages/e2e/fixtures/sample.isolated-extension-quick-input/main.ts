import { activate as activateExtensionApi, registerCommand, showQuickPick } from '@lvce-editor/api'

const execute = async (): Promise<void> => {
  await showQuickPick({
    placeholder: 'Select isolated option',
    items: [
      { label: 'Isolated Option 1', description: 'First isolated option', value: 'isolated-option-1' },
      { label: 'Isolated Option 2', description: 'Second isolated option', value: 'isolated-option-2' },
      { label: 'Isolated Option 3', description: 'Third isolated option', value: 'isolated-option-3' },
    ],
  })
}

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedQuickPickSample',
    execute,
  })
}

await activate()
