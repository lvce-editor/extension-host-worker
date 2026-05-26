let count = 0

const statusBarProvider = {
  id: 'xyz',
  getStatusBarItem() {
    return {
      text: `${count}`,
      icon: '',
      name: 123,
      onClick: '',
    }
  },
}

export const activate = () => {
  // @ts-ignore
  const statusBarHandle = vscode.registerStatusBarItemProvider(statusBarProvider)
}
