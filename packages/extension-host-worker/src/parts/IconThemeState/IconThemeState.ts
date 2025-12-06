import * as InitialIconTheme from '../InitialIconTheme/InitialIconTheme.ts'

const state: any = {
  extensionPath: '',
  hasWarned: [],
  /**
   * @type{any}
   */
  iconTheme: InitialIconTheme.initialIconTheme,
  seenFiles: [],
  seenFolders: [],
}

export const setTheme = (iconTheme) => {
  state.iconTheme = iconTheme.json
  state.extensionPath = iconTheme.extensionPath
}

export const getIconTheme = (): any => {
  return state.iconTheme
}

export const getState = () => {
  return state
}
