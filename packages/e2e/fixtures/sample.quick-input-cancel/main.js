export const activate = async () => {
  // @ts-ignore
  const result = await vscode.showQuickInput({
    ignoreFocusOut: false,
    initialValue: 'test',
    render: async (searchValue) => {
      return [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ]
    },
  })

  if (result.canceled) {
    console.log('Quick input was canceled')
  } else {
    console.log('Quick input result:', result.inputValue)
  }
}
