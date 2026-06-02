import { getCommandRegistrySnapshot } from '../../../../extension-api/src/parts/Command/Command.ts'
import { getFormattingProviderRegistrySnapshot } from '../../../../extension-api/src/parts/Formatting/Formatting.ts'

interface ManifestCommand {
  readonly id?: unknown
}

interface ManifestFormattingProvider {
  readonly id?: unknown
}

interface ExtensionManifest {
  readonly commands?: readonly ManifestCommand[]
  readonly formattingProviders?: readonly ManifestFormattingProvider[]
  readonly isolated?: boolean
}

const getManifestCommandIds = (extension: ExtensionManifest): readonly string[] => {
  if (!Array.isArray(extension.commands)) {
    return []
  }
  return extension.commands.map((command) => command.id).filter((id): id is string => typeof id === 'string')
}

const getManifestFormattingProviderIds = (extension: ExtensionManifest): readonly string[] => {
  if (!Array.isArray(extension.formattingProviders)) {
    return []
  }
  return extension.formattingProviders.map((provider) => provider.id).filter((id): id is string => typeof id === 'string')
}

const assertUniqueIds = (ids: readonly string[], label: string): void => {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`${label} ${id} is contributed multiple times`)
    }
    seen.add(id)
  }
}

const getNewRegisteredCommandIds = (beforeCommandIds: readonly string[]): readonly string[] => {
  const before = new Set(beforeCommandIds)
  return getCommandRegistrySnapshot()
    .commands.map((command) => command.id)
    .filter((commandId) => !before.has(commandId))
}

const getNewRegisteredFormattingProviderIds = (beforeFormattingProviderIds: readonly string[]): readonly string[] => {
  const before = new Set(beforeFormattingProviderIds)
  return getFormattingProviderRegistrySnapshot()
    .providers.map((provider) => provider.id)
    .filter((providerId) => !before.has(providerId))
}

export const getRegisteredCommandIds = (): readonly string[] => {
  return getCommandRegistrySnapshot().commands.map((command) => command.id)
}

export const getRegisteredFormattingProviderIds = (): readonly string[] => {
  return getFormattingProviderRegistrySnapshot().providers.map((provider) => provider.id)
}

const validateIsolatedExtensionContribution = (
  label: string,
  manifestIds: readonly string[],
  registeredIds: readonly string[],
): void => {
  assertUniqueIds(manifestIds, label)
  const manifestIdSet = new Set(manifestIds)
  const registeredIdSet = new Set(registeredIds)
  for (const registeredId of registeredIds) {
    if (!manifestIdSet.has(registeredId)) {
      throw new Error(`${label} ${registeredId} is registered but not contributed in extension.json`)
    }
  }
  for (const manifestId of manifestIds) {
    if (!registeredIdSet.has(manifestId)) {
      throw new Error(`${label} ${manifestId} is contributed in extension.json but not registered`)
    }
  }
}

export const validateIsolatedExtensionCommands = (extension: ExtensionManifest, beforeCommandIds: readonly string[]): void => {
  if (!extension.isolated) {
    return
  }
  const manifestCommandIds = getManifestCommandIds(extension)
  const registeredCommandIds = getNewRegisteredCommandIds(beforeCommandIds)
  validateIsolatedExtensionContribution('command', manifestCommandIds, registeredCommandIds)
}

export const validateIsolatedExtensionFormattingProviders = (extension: ExtensionManifest, beforeFormattingProviderIds: readonly string[]): void => {
  if (!extension.isolated) {
    return
  }
  const manifestFormattingProviderIds = getManifestFormattingProviderIds(extension)
  const registeredFormattingProviderIds = getNewRegisteredFormattingProviderIds(beforeFormattingProviderIds)
  validateIsolatedExtensionContribution('formatting provider', manifestFormattingProviderIds, registeredFormattingProviderIds)
}
