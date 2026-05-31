let resultText = 'idle'

const branchItems = [
  {
    label: 'main',
    description: 'Default branch',
    value: 'main',
  },
  {
    label: 'feature/search',
    description: 'Remote branch',
    value: 'feature/search',
  },
  {
    label: 'release/2026',
    description: 'Release branch',
    value: 'release/2026',
  },
]

const statusBarProvider = {
  id: 'quickpick.result',
  getStatusBarItem() {
    return {
      text: resultText,
      icon: '',
      name: 'quickpick.result',
      onClick: '',
    }
  },
}

export const activate = () => {
  // @ts-ignore
  const statusBarHandle = vscode.registerStatusBarItemProvider(statusBarProvider)

  // @ts-ignore
  vscode.registerCommand({
    id: 'quickPickBranches',
    async execute() {
      // @ts-ignore
      const selectedBranch = await vscode.showQuickPick({
        placeholder: 'Select branch',
        items: branchItems,
      })
      resultText = selectedBranch || 'canceled'
      await statusBarHandle.refresh()
    },
  })
}
