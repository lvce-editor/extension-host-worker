const getStatusBarItems = (): readonly never[] => {
  return []
}

export const commandMap = {
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
}
