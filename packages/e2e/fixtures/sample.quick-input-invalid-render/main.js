export const activate = async () => {
  try {
    // @ts-ignore
    const result = await vscode.showQuickInput({
      ignoreFocusOut: false,
      initialValue: 'test',
      render: 'not a function', // Invalid: should be a function
    })

    console.log('Quick input result:', result.inputValue)
  } catch (error) {
    console.error('Quick input error:', error.message)
  }
}
