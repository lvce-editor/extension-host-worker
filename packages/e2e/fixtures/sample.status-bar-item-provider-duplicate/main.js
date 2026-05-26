let text = 'loading'

const statusBarProvider = {
  id: 'xyz',
  getStatusBarItem() {
    return {
      text,
      icon: '',
      name: 'xyz',
      onClick: '',
    }
  },
}

const duplicateStatusBarProvider = {
  id: 'xyz',
  getStatusBarItem() {
    return {
      text: 'duplicate',
      icon: '',
      name: 'xyz duplicate',
      onClick: '',
    }
  },
}

const expectedErrorMessage = 'Failed to register status bar item provider xyz: status bar item provider cannot be registered multiple times'

export const activate = async () => {
  // @ts-ignore
  const statusBarHandle = vscode.registerStatusBarItemProvider(statusBarProvider)
  try {
    // @ts-ignore
    vscode.registerStatusBarItemProvider(duplicateStatusBarProvider)
    text = 'failed'
  } catch (error) {
    text = error && error.message === expectedErrorMessage ? 'passed' : 'failed'
  }
  await statusBarHandle.refresh()
}
