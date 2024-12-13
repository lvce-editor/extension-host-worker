export const isDataCloneError = (error: any): boolean => {
  return error && error.name === 'DataCloneError'
}
