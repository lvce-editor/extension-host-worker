let count = 0

const statusBarProvider = {
  id: 'xyz',
  getStatusBarItem() {
    return {
      text: count,
      icon: '',
      name: 'xyz',
      onClick: '',
    }
  },
}

export const activate = () => {
  // @ts-ignore
  const statusBarHandle = vscode.registerStatusBarItemProvider(statusBarProvider)
  // @ts-ignore
  vscode.registerCommand({
    id: 'xyz.increment',
    async execute() {
      count++
      await statusBarHandle.refresh()
    },
  })
}
