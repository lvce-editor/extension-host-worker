import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.ts'

interface Provider {
  readonly id: string
  readonly label: string
}

const providers: Record<string, Provider> = Object.create(null)

export const registerOutputChannel = (provider) => {
  providers[provider.id] = provider
  const uri = `output://${provider.id}`
  return {
    async append(text) {
      await FileSystemWorker.append(uri, text)
    },
    getUri() {
      return uri
    },
  }
}

export const getEnabledProviders = (): readonly Provider[] => {
  const values = Object.values(providers)
  const enabledProviders: Provider[] = []
  for (const provider of values) {
    enabledProviders.push({ id: provider.id, label: provider.label })
  }
  return enabledProviders
}

export const reset = () => {}
