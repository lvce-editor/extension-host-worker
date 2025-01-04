import * as InitialIconTheme from '../InitialIconTheme/InitialIconTheme.ts'

const state: any = {
  seenFiles: [],
  seenFolders: [],
  hasWarned: [],
  /**
   * @type{any}
   */
  iconTheme: InitialIconTheme.initialIconTheme,
  extensionPath: '',
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
