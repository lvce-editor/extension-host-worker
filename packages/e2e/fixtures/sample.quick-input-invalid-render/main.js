export const activate = async () => {
  try {
    // @ts-ignore
    const result = await vscode.showQuickPick({
      placeholder: 'Select option',
      items: 'not an array',
    })

    console.log('Quick pick result:', result)
  } catch (error) {
    console.error('Quick pick error:', error.message)
  }
}
