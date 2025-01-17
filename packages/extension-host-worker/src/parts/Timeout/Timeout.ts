export const sleep = (duration: number): Promise<void> => {
  const { resolve, promise } = Promise.withResolvers<undefined>()
  setTimeout(resolve, duration)
  return promise
}
