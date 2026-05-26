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

const incrementCommand = {
  id: 'xyz.increment',
  execute() {
    count++
    // TODO notify vsc  ode of status bar item change?
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerStatusBarItemProvider(statusBarProvider)
  // @ts-ignore
  vscode.registerCommand(incrementCommand)
}
