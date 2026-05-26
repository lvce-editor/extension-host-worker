const statusBarProvider = {
  id: 'xyz',
  getStatusBarItem() {
    return {
      text: 'abc',
      icon: '',
      name: 'xyz',
      onClick: '',
    }
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerStatusBarItemProvider(statusBarProvider)
}
