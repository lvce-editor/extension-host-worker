import { VError } from '../VError/VError.ts'

const fileSystemProviderMap = Object.create(null)

export const get = (protocol) => {
  const provider = fileSystemProviderMap[protocol]
  if (!provider) {
    // @ts-ignore
    throw new VError(`no file system provider for protocol "${protocol}" found`)
  }
  return provider
}

export const set = (id, provider) => {
  if (!id) {
    throw new Error('Failed to register file system provider: missing id')
  }
  fileSystemProviderMap[id] = provider
}
