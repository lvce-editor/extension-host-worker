const statusBarProvider = {
  id: 'xyz',
  getStatusBarItem() {
    return {
      label: 'abc',
      icon: '',
    }
  },
}

export const activate = () => {
  console.log('act')
  // @ts-ignore
  vscode.registerStatusBarProvider(statusBarProvider)
}
