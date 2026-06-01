export interface StatusBarItem {
  readonly icon?: string
  readonly name?: string
  readonly onClick?: string
  readonly text?: string
  readonly title?: string
}

export interface StatusBarItemProvider {
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}

export interface StatusBarItemProviderHandle {
  readonly refresh: () => Promise<void>
}

const getExtensionHostApi = (): any => {
  return (globalThis as any).vscode
}

export const registerStatusBarItemProvider = (provider: StatusBarItemProvider): StatusBarItemProviderHandle => {
  return getExtensionHostApi().registerStatusBarItemProvider(provider)
}
