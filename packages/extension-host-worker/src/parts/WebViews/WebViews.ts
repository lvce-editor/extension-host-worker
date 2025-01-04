interface State {
  webViews: readonly any[]
}

const state: State = {
  webViews: [],
}

export const add = (webView: any): void => {
  state.webViews = [...state.webViews, webView]
}

export const addMany = (webViews: any[]) => {
  state.webViews = [...state.webViews, ...webViews]
}

export const get = (): readonly any[] => {
  return state.webViews
}
