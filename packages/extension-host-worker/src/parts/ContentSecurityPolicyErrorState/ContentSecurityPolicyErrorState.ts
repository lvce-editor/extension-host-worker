interface State {
  errors: readonly any[]
}

const state: State = {
  errors: [],
}

export const reset = (): void => {
  state.errors = []
}

export const addError = (error: any): void => {
  state.errors = [...state.errors, error]
}

export const hasRecentErrors = (): boolean => {
  return state.errors.length > 0
}

export const getRecentError = (): any => {
  state.errors.at(-1)
}
