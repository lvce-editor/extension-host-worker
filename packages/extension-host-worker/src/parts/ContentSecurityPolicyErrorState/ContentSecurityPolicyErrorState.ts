const state = {
  /**
   * @type {any[]}
   */
  errors: [],
}

export const addError = (error) => {
  // @ts-ignore
  state.errors.push(error)
}

export const hasRecentErrors = () => {
  return state.errors.length > 0
}

export const getRecentError = () => {
  state.errors.at(-1)
}
