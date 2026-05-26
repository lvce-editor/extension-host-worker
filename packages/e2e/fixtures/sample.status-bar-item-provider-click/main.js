let count = 0

const statusBarProvider = {
  id: 'xyz',
  getStatusBarItem() {
    return {
      text: `${count}`,
      icon: '',
      name: 'xyz',
      onClick: '',
    }
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerStatusBarItemProvider(statusBarProvider)
  // @ts-ignore
  vscode.registerCommand({
    id: 'xyz.increment',
    execute() {
      count++
      // TODO notify vscode of status bar item change?
    },
  })
}
