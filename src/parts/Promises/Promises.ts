export const withResolvers = () => {
  /**
   * @type {any}
   */
  let _resolve
  const promise = new Promise((resolve) => {
    _resolve = resolve
  })
  return {
    resolve: _resolve,
    promise,
  }
}
