import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as ExtensionHostCompletion from '../ExtensionHostCompletion/ExtensionHostCompletion.ts'
import * as ExtensionHostDiagnostic from '../ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import * as ExtensionHostFormatting from '../ExtensionHostFormatting/ExtensionHostFormatting.ts'
import * as ExtensionHostHover from '../ExtensionHostHover/ExtensionHostHover.ts'

interface ManifestCommand {
  readonly id?: unknown
}

interface ManifestFormattingProvider {
  readonly id?: unknown
}

interface ManifestCompletionProvider {
  readonly id?: unknown
}

interface ManifestHoverProvider {
  readonly id?: unknown
}

interface ManifestDiagnosticProvider {
  readonly id?: unknown
}

interface ExtensionManifest {
  readonly commands?: readonly ManifestCommand[]
  readonly completionProviders?: readonly ManifestCompletionProvider[]
  readonly diagnosticProviders?: readonly ManifestDiagnosticProvider[]
  readonly formattingProviders?: readonly ManifestFormattingProvider[]
  readonly hoverProviders?: readonly ManifestHoverProvider[]
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

const getManifestCompletionProviderIds = (extension: ExtensionManifest): readonly string[] => {
  if (!Array.isArray(extension.completionProviders)) {
    return []
  }
  return extension.completionProviders.map((provider) => provider.id).filter((id): id is string => typeof id === 'string')
}

const getManifestHoverProviderIds = (extension: ExtensionManifest): readonly string[] => {
  if (!Array.isArray(extension.hoverProviders)) {
    return []
  }
  return extension.hoverProviders.map((provider) => provider.id).filter((id): id is string => typeof id === 'string')
}

const getManifestDiagnosticProviderIds = (extension: ExtensionManifest): readonly string[] => {
  if (!Array.isArray(extension.diagnosticProviders)) {
    return []
  }
  return extension.diagnosticProviders.map((provider) => provider.id).filter((id): id is string => typeof id === 'string')
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
  return ExtensionHostCommand.getRegisteredCommandIds().filter((commandId) => !before.has(commandId))
}

const getNewRegisteredFormattingProviderIds = (beforeFormattingProviderIds: readonly string[]): readonly string[] => {
  const before = new Set(beforeFormattingProviderIds)
  return ExtensionHostFormatting.getRegisteredFormattingProviderIds().filter((providerId) => !before.has(providerId))
}

const getNewRegisteredCompletionProviderIds = (beforeCompletionProviderIds: readonly string[]): readonly string[] => {
  const before = new Set(beforeCompletionProviderIds)
  return ExtensionHostCompletion.getRegisteredCompletionProviderIds().filter((providerId) => !before.has(providerId))
}

const getNewRegisteredHoverProviderIds = (beforeHoverProviderIds: readonly string[]): readonly string[] => {
  const before = new Set(beforeHoverProviderIds)
  return ExtensionHostHover.getRegisteredHoverProviderIds().filter((providerId) => !before.has(providerId))
}

const getNewRegisteredDiagnosticProviderIds = (beforeDiagnosticProviderIds: readonly string[]): readonly string[] => {
  const before = new Set(beforeDiagnosticProviderIds)
  return ExtensionHostDiagnostic.getRegisteredDiagnosticProviderIds().filter((providerId) => !before.has(providerId))
}

export const getRegisteredCommandIds = (): readonly string[] => {
  return ExtensionHostCommand.getRegisteredCommandIds()
}

export const getRegisteredCompletionProviderIds = (): readonly string[] => {
  return ExtensionHostCompletion.getRegisteredCompletionProviderIds()
}

export const getRegisteredFormattingProviderIds = (): readonly string[] => {
  return ExtensionHostFormatting.getRegisteredFormattingProviderIds()
}

export const getRegisteredHoverProviderIds = (): readonly string[] => {
  return ExtensionHostHover.getRegisteredHoverProviderIds()
}

export const getRegisteredDiagnosticProviderIds = (): readonly string[] => {
  return ExtensionHostDiagnostic.getRegisteredDiagnosticProviderIds()
}

const validateIsolatedExtensionContribution = (label: string, manifestIds: readonly string[], registeredIds: readonly string[]): void => {
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

export const validateIsolatedExtensionCompletionProviders = (extension: ExtensionManifest, beforeCompletionProviderIds: readonly string[]): void => {
  if (!extension.isolated) {
    return
  }
  const manifestCompletionProviderIds = getManifestCompletionProviderIds(extension)
  const registeredCompletionProviderIds = getNewRegisteredCompletionProviderIds(beforeCompletionProviderIds)
  validateIsolatedExtensionContribution('completion provider', manifestCompletionProviderIds, registeredCompletionProviderIds)
}

export const validateIsolatedExtensionFormattingProviders = (extension: ExtensionManifest, beforeFormattingProviderIds: readonly string[]): void => {
  if (!extension.isolated) {
    return
  }
  const manifestFormattingProviderIds = getManifestFormattingProviderIds(extension)
  const registeredFormattingProviderIds = getNewRegisteredFormattingProviderIds(beforeFormattingProviderIds)
  validateIsolatedExtensionContribution('formatting provider', manifestFormattingProviderIds, registeredFormattingProviderIds)
}

export const validateIsolatedExtensionHoverProviders = (extension: ExtensionManifest, beforeHoverProviderIds: readonly string[]): void => {
  if (!extension.isolated) {
    return
  }
  const manifestHoverProviderIds = getManifestHoverProviderIds(extension)
  const registeredHoverProviderIds = getNewRegisteredHoverProviderIds(beforeHoverProviderIds)
  validateIsolatedExtensionContribution('hover provider', manifestHoverProviderIds, registeredHoverProviderIds)
}

export const validateIsolatedExtensionDiagnosticProviders = (extension: ExtensionManifest, beforeDiagnosticProviderIds: readonly string[]): void => {
  if (!extension.isolated) {
    return
  }
  const manifestDiagnosticProviderIds = getManifestDiagnosticProviderIds(extension)
  const registeredDiagnosticProviderIds = getNewRegisteredDiagnosticProviderIds(beforeDiagnosticProviderIds)
  validateIsolatedExtensionContribution('diagnostic provider', manifestDiagnosticProviderIds, registeredDiagnosticProviderIds)
}
