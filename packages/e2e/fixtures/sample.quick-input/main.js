const execute = async () => {
  // @ts-ignore
  await vscode.showQuickInput({
    ignoreFocusOut: false,
    initialValue: 'test',
    waitUntil: 'visible',
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
}

export const activate = async () => {
  vscode.registerCommand({
    id: 'quickPickSample',
    execute,
  })
}
