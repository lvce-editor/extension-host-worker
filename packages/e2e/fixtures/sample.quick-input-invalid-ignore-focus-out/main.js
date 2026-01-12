export const activate = async () => {
  try {
    // @ts-ignore
    const result = await vscode.showQuickInput({
      ignoreFocusOut: 'not a boolean', // Invalid: should be a boolean
      initialValue: 'test',
      render: async (searchValue) => {
        return [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]
      },
    })

    console.log('Quick input result:', result.inputValue)
  } catch (error) {
    console.error('Quick input error:', error.message)
  }
}
