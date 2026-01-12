const execute = async () => {
  // @ts-ignore
  const result = await vscode.showQuickInput({
    ignoreFocusOut: false,
    initialValue: 'test',
    render: async (searchValue) => {
      if (!searchValue) {
        return [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]
      }
      return [
        { label: `Search: ${searchValue}`, value: searchValue },
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ]
    },
  })

  if (!result.canceled) {
    console.log('Quick input result:', result.inputValue)
  } else {
    console.log('Quick input was canceled')
  }
}

export const activate = async () => {
  vscode.registerCommand({
    id: 'quickPickSample',
    execute,
  })
}
