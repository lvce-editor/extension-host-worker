export const activate = async () => {
  try {
    // @ts-ignore
    const result = await vscode.showQuickPick({
      placeholder: 'Select option',
      items: [
        { label: 'Option 1', description: 'First option' },
        { label: 'Option 2', description: 'Second option', value: 'option2' },
      ],
    })

    console.log('Quick pick result:', result)
  } catch (error) {
    console.error('Quick pick error:', error.message)
  }
}
