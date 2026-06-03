import type { Disposable } from '../Disposable/Disposable.ts'
import type { HoverProvider } from '../HoverProvider/HoverProvider.ts'
import type { HoverProviderRegistrySnapshot } from '../HoverProviderRegistrySnapshot/HoverProviderRegistrySnapshot.ts'
import type { HoverResult } from '../HoverResult/HoverResult.ts'
import type { TextDocument } from '../HoverTextDocument/HoverTextDocument.ts'
import type { RegisteredHoverProvider } from '../RegisteredHoverProvider/RegisteredHoverProvider.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

const getType = (value: unknown): string => {
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  return typeof value
}

const validateHoverResult = (hover: unknown): HoverResult | undefined => {
  if (hover === undefined) {
    return undefined
  }
  if (!hover || typeof hover !== 'object' || Array.isArray(hover)) {
    throw new ExtensionApiError(`invalid hover result: hover must be of type object or undefined but is ${getType(hover)}`)
  }
  return hover
}

const registry = createProviderRegistry<HoverProvider, RegisteredHoverProvider>({
  mapProvider(provider) {
    return {
      id: provider.id,
      languageId: provider.languageId,
      provideHover(textDocument, offset, ...args) {
        return provider.provideHover(textDocument, offset, ...args)
      },
    }
  },
  providerName: 'hover provider',
  requiredMethods: ['provideHover'],
  requireLanguageId: true,
})

export const hasHoverProvider = registry.hasProvider

export const registerHoverProvider = (provider: HoverProvider): Disposable => {
  const registeredProvider = registry.registerProvider(provider)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
    },
  }
}

export const executeHoverProvider = async (
  textDocument: TextDocument,
  offset: number,
  ...args: readonly unknown[]
): Promise<HoverResult | undefined> => {
  return registry.executeProviderByLanguageId(textDocument.languageId, 'provideHover', [textDocument, offset, ...args], validateHoverResult)
}

export const getHoverProviders = registry.getProviders

export const getHoverProviderRegistrySnapshot = (): HoverProviderRegistrySnapshot => {
  return {
    providers: registry.getProviders().map((provider) => ({
      id: provider.id,
      languageId: provider.languageId,
    })),
  }
}

export const resetHoverProviderRegistry = registry.reset
