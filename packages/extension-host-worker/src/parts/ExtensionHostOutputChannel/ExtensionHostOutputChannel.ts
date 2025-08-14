import type { OutputChannelProvider } from '../OutputChannelProvider/OutputChannelProvider.ts'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.ts'
import { getOutputFilePath } from '../GetOutputFilePath/GetOutputFilePath.ts'

const providers: Record<string, OutputChannelProvider> = Object.create(null)

export const registerOutputChannel = (provider) => {
  if (!provider) {
    throw new Error(`provider is required`)
  }
  if (!provider.id) {
    throw new Error('provider.id is required')
  }
  if (!provider.label) {
    throw new Error('provider.label is required')
  }
  const uri = getOutputFilePath(provider.id)
  providers[provider.id] = {
    ...provider,
  }
  return {
    async append(text) {
      await FileSystemWorker.append(uri, text)
    },
    getUri() {
      return uri
    },
  }
}

export const getEnabledProviders = (): readonly OutputChannelProvider[] => {
  const values = Object.values(providers)
  const enabledProviders: OutputChannelProvider[] = []
  for (const provider of values) {
    enabledProviders.push({
      id: provider.id,
      label: provider.label,
      uri: provider.uri,
    })
  }
  return enabledProviders
}

export const reset = () => {}
