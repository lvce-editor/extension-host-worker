import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as Assert from '../Assert/Assert.ts'
import * as ExecuteIsolatedSourceControlProvider from '../ExecuteIsolatedSourceControlProvider/ExecuteIsolatedSourceControlProvider.ts'
import { getRemoteUrlSync } from '../ExtensionHostUrl/ExtensionHostUrl.ts'
import { getExtensions } from '../GetExtensions/GetExtensions.ts'

export const state = {
  providers: Object.create(null),
}

export const registerSourceControlProvider = (provider) => {
  state.providers[provider.id] = provider
}

export const getRegisteredSourceControlProviderIds = (): readonly string[] => {
  return Object.keys(state.providers)
}

const getProvider = (providerId) => {
  const provider = state.providers[providerId]
  if (!provider) {
    throw new Error('no source control provider found')
  }
  return provider
}

const getFilesFromProvider = (provider) => {
  return provider.getChangedFiles()
}

export const getChangedFiles = async (providerId) => {
  const provider = state.providers[providerId]
  if (provider) {
    return getFilesFromProvider(provider)
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGetChangedFiles')
  if (isolated.found) {
    return isolated.result
  }
  return getFilesFromProvider(getProvider(providerId))
}

export const getBadgeCount = async (providerId) => {
  const provider = state.providers[providerId]
  if (provider) {
    if (typeof provider.getBadgeCount === 'function') {
      return provider.getBadgeCount()
    }
    const changedFiles = await getFilesFromProvider(provider)
    return changedFiles.length
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGetBadgeCount')
  if (isolated.found) {
    return isolated.result
  }
  return getFilesFromProvider(getProvider(providerId))
}

export const getFileBefore = async (providerId, uri) => {
  Assert.string(providerId)
  Assert.string(uri)
  const provider = state.providers[providerId]
  if (provider) {
    return provider.getFileBefore(uri)
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGetFileBefore', uri)
  if (isolated.found) {
    return isolated.result
  }
  return getProvider(providerId).getFileBefore(uri)
}

const getFileBeforeUriFromProvider = async (provider, uri): Promise<string> => {
  if (typeof provider.getFileBeforeUri === 'function') {
    return provider.getFileBeforeUri(uri)
  }
  const content = await provider.getFileBefore?.(uri)
  return `data://${content ?? ''}`
}

export const getFileBeforeUri = async (providerId, uri): Promise<string> => {
  Assert.string(providerId)
  Assert.string(uri)
  const provider = state.providers[providerId]
  if (provider) {
    return getFileBeforeUriFromProvider(provider, uri)
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGetFileBeforeUri', uri)
  if (isolated.found) {
    return isolated.result as string
  }
  return getFileBeforeUriFromProvider(getProvider(providerId), uri)
}

const getGroupsFromProvider = async (provider, cwd) => {
  if (provider.getGroups) {
    return provider.getGroups(cwd)
  }
  if (provider.getChangedFiles) {
    const files = await provider.getChangedFiles()
    const groups = [
      {
        id: 'changes',
        items: files,
        label: 'Changes',
      },
    ]
    return groups
  }
  throw new Error('source control provider is missing required function getGroups')
}

export const getGroups = async (providerId, cwd) => {
  const provider = state.providers[providerId]
  if (provider) {
    return getGroupsFromProvider(provider, cwd)
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGetGroups', cwd)
  if (isolated.found) {
    return isolated.result
  }
  return getGroupsFromProvider(getProvider(providerId), cwd)
}

export const acceptInput = async (providerId, value) => {
  const provider = state.providers[providerId]
  if (provider) {
    await provider.acceptInput(value)
    return
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlAcceptInput', value)
  if (!isolated.found) {
    getProvider(providerId)
  }
}

export const generateCommitMessage = async (providerId) => {
  const provider = state.providers[providerId]
  if (provider) {
    if (typeof provider.generateCommitMessage !== 'function') {
      throw new TypeError('source control provider is missing required function generateCommitMessage')
    }
    return provider.generateCommitMessage()
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGenerateCommitMessage')
  if (isolated.found) {
    return isolated.result
  }
  return getProvider(providerId)
}

export const getFeatures = async (providerId) => {
  const provider = state.providers[providerId]
  if (provider) {
    if (typeof provider.getFeatures === 'function') {
      return provider.getFeatures()
    }
    if (provider.features && typeof provider.features === 'object') {
      return provider.features
    }
    if ('showGenerateCommitMessageButton' in provider) {
      return {
        showGenerateCommitMessageButton: provider.showGenerateCommitMessageButton,
      }
    }
    return {}
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGetFeatures')
  if (isolated.found) {
    return isolated.result
  }
  return getProvider(providerId)
}

export const add = async (providerId, path?) => {
  if (path === undefined) {
    const provider = Object.values(state.providers)[0]
    if (provider) {
      // @ts-ignore
      await provider.add(providerId)
    }
    return
  }
  const provider = state.providers[providerId]
  if (provider) {
    await provider.add(path)
    return
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlAdd', path)
  if (!isolated.found) {
    getProvider(providerId)
  }
}

export const discard = async (providerId, path?) => {
  if (path === undefined) {
    const provider = Object.values(state.providers)[0]
    if (provider) {
      // @ts-ignore
      await provider.discard(providerId)
    }
    return
  }
  const provider = state.providers[providerId]
  if (provider) {
    await provider.discard(path)
    return
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlDiscard', path)
  if (!isolated.found) {
    getProvider(providerId)
  }
}

export const getEnabledProviderIds = async (scheme, root) => {
  Assert.string(scheme)
  Assert.string(root)
  const providers = Object.values(state.providers)
  const enabledIds = []
  for (const provider of providers) {
    // @ts-ignore
    if (typeof provider.isActive !== 'function') {
      continue
    }
    // @ts-ignore
    const isActive = await provider.isActive(scheme, root)
    if (isActive) {
      // @ts-ignore
      enabledIds.push(provider.id)
    }
  }
  const isolatedIds = await ExecuteIsolatedSourceControlProvider.getEnabledProviderIds(scheme, root)
  return [...new Set([...enabledIds, ...isolatedIds])]
}

export const reset = () => {
  state.providers = Object.create(null)
}

export const getIconDefinitions = async (providerId): Promise<readonly string[]> => {
  const extensions = await getExtensions()
  const webextensions = await ExtensionManagementWorker.invoke(`Extensions.getDynamicWebExtensions`)
  const allExtensions = [...extensions, ...webextensions]

  for (const extension of allExtensions) {
    const id = extension.id.split('.')
    const shortId = id[1]
    if (shortId === providerId && extension['source-control-icons'] && Array.isArray(extension['source-control-icons'])) {
      const baseIcons = extension['source-control-icons']
      const absoluteUris = baseIcons.map((icon) => `${extension.uri}/${icon}`)
      const remoteUris = absoluteUris.map((icon) => getRemoteUrlSync(icon))
      return remoteUris
    }
  }
  // TODO return warning that no icons were found?
  return []
}

export const getFileDecorations = async (providerId: any, uris: readonly string[]): Promise<readonly any[]> => {
  const provider = state.providers[providerId]
  if (provider) {
    // @ts-ignore
    return provider.getFileDecorations ? provider.getFileDecorations(uris) : []
  }
  const isolated = await ExecuteIsolatedSourceControlProvider.execute(providerId, 'executeSourceControlGetFileDecorations', uris)
  return isolated.found ? (isolated.result as readonly any[]) : []
}
