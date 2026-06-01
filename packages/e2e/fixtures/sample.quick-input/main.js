const execute = async () => {
  // @ts-ignore
  const result = await vscode.showQuickPick({
    placeholder: 'Select option',
    items: [
      { label: 'Option 1', description: 'First option', value: 'option1' },
      { label: 'Option 2', description: 'Second option', value: 'option2' },
      { label: 'Option 3', description: 'Third option', value: 'option3' },
    ],
  })

  if (result) {
    console.log('Quick pick result:', result)
  } else {
    console.log('Quick pick was canceled')
  }
}

export const activate = async () => {
  vscode.registerCommand({
    id: 'quickPickSample',
    execute,
  })
}
