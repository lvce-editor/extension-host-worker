import { getCommandRegistrySnapshot } from '../../../../extension-api/src/parts/Command/Command.ts'

interface ManifestCommand {
  readonly id?: unknown
}

interface ExtensionManifest {
  readonly commands?: readonly ManifestCommand[]
  readonly isolated?: boolean
}

const getManifestCommandIds = (extension: ExtensionManifest): readonly string[] => {
  if (!Array.isArray(extension.commands)) {
    return []
  }
  return extension.commands.map((command) => command.id).filter((id): id is string => typeof id === 'string')
}

const assertUniqueCommandIds = (commandIds: readonly string[]): void => {
  const seen = new Set<string>()
  for (const commandId of commandIds) {
    if (seen.has(commandId)) {
      throw new Error(`command ${commandId} is contributed multiple times`)
    }
    seen.add(commandId)
  }
}

const getNewRegisteredCommandIds = (beforeCommandIds: readonly string[]): readonly string[] => {
  const before = new Set(beforeCommandIds)
  return getCommandRegistrySnapshot()
    .commands.map((command) => command.id)
    .filter((commandId) => !before.has(commandId))
}

export const getRegisteredCommandIds = (): readonly string[] => {
  return getCommandRegistrySnapshot().commands.map((command) => command.id)
}

export const validateIsolatedExtensionCommands = (extension: ExtensionManifest, beforeCommandIds: readonly string[]): void => {
  if (!extension.isolated) {
    return
  }
  const manifestCommandIds = getManifestCommandIds(extension)
  assertUniqueCommandIds(manifestCommandIds)
  const manifestCommandIdSet = new Set(manifestCommandIds)
  const registeredCommandIds = getNewRegisteredCommandIds(beforeCommandIds)
  const registeredCommandIdSet = new Set(registeredCommandIds)
  for (const registeredCommandId of registeredCommandIds) {
    if (!manifestCommandIdSet.has(registeredCommandId)) {
      throw new Error(`command ${registeredCommandId} is registered but not contributed in extension.json`)
    }
  }
  for (const manifestCommandId of manifestCommandIds) {
    if (!registeredCommandIdSet.has(manifestCommandId)) {
      throw new Error(`command ${manifestCommandId} is contributed in extension.json but not registered`)
    }
  }
}
