import type { Disposable } from '../Disposable/Disposable.ts'
import type { ExplorerContext } from '../ExplorerContext/ExplorerContext.ts'
import type { ExplorerContextMenuEntry } from '../ExplorerContextMenuEntry/ExplorerContextMenuEntry.ts'
import type { ExplorerContextMenuProvider } from '../ExplorerContextMenuProvider/ExplorerContextMenuProvider.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

const registry = createProviderRegistry<ExplorerContextMenuProvider, ExplorerContextMenuProvider>({
  mapProvider: (provider) => ({ id: provider.id, provideMenuEntries: (context) => provider.provideMenuEntries(context) }),
  providerName: 'explorer context menu provider',
  requiredMethods: ['provideMenuEntries'],
})

const validateEntries = (entries: readonly ExplorerContextMenuEntry[]): readonly ExplorerContextMenuEntry[] => {
  if (!Array.isArray(entries)) throw new ExtensionApiError('Explorer menu entries must be an array')
  return entries.map((entry) => {
    if (!entry || [entry.id, entry.label, entry.command].some((value) => typeof value !== 'string' || value.length === 0)) {
      throw new ExtensionApiError('Explorer menu entries require an id, label and command')
    }
    return { command: entry.command, id: entry.id, label: entry.label }
  })
}

export const getExplorerContextMenuEntries = async (context: ExplorerContext): Promise<readonly ExplorerContextMenuEntry[]> => {
  if (!context || typeof context.uri !== 'string' || typeof context.isDirectory !== 'boolean') {
    throw new ExtensionApiError('Explorer context requires a uri and isDirectory flag')
  }
  // Each provider receives an independent snapshot of the clicked resource.
  const results = await Promise.all(
    registry.getProviders().map(async (provider) => {
      const entries = validateEntries(await provider.provideMenuEntries({ ...context }))
      // Disposal during an asynchronous callback must not resurrect menu contributions.
      return registry.getProviders().includes(provider) ? entries : []
    }),
  )
  return results.flat()
}

export const registerExplorerContextMenuProvider = (provider: ExplorerContextMenuProvider): Disposable => {
  const registered = registry.registerProvider(provider)
  ExtensionApiCommandRegistry.registerCommandMap({ 'ExtensionApi.getExplorerContextMenuEntries': getExplorerContextMenuEntries })
  return {
    dispose(): void {
      if (registry.getProviders().includes(registered)) registry.deleteProvider(registered.id)
    },
  }
}

export const resetExplorerContextMenuProviders = registry.reset
