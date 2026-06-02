import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import type { CompletionProvider } from '../CompletionProvider/CompletionProvider.ts'
import type { CompletionProviderRegistrySnapshot } from '../CompletionProviderRegistrySnapshot/CompletionProviderRegistrySnapshot.ts'
import type { TextDocument } from '../CompletionTextDocument/CompletionTextDocument.ts'
import type { Disposable } from '../Disposable/Disposable.ts'
import type { RegisteredCompletionProvider } from '../RegisteredCompletionProvider/RegisteredCompletionProvider.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

const getType = (value: unknown): string => {
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
  return typeof value
}

const validateCompletionResult = (completion: unknown): readonly CompletionItem[] => {
  if (!Array.isArray(completion)) {
    throw new ExtensionApiError(`invalid completion result: completion must be of type array but is ${getType(completion)}`)
  }
  for (const item of completion) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new ExtensionApiError(`invalid completion result: expected completion item to be of type object but was of type ${getType(item)}`)
    }
  }
  return completion
}

const registry = createProviderRegistry<CompletionProvider, RegisteredCompletionProvider>({
  mapProvider(provider) {
    return {
      id: provider.id,
      languageId: provider.languageId,
      provideCompletions(textDocument, offset, ...args) {
        return provider.provideCompletions(textDocument, offset, ...args)
      },
      resolveCompletionItem: provider.resolveCompletionItem
        ? (textDocument, offset, name, completionItem, ...args) =>
            provider.resolveCompletionItem?.(textDocument, offset, name, completionItem, ...args)
        : undefined,
    }
  },
  optionalMethods: ['resolveCompletionItem'],
  providerName: 'completion provider',
  requiredMethods: ['provideCompletions'],
  requireLanguageId: true,
})

export const hasCompletionProvider = registry.hasProvider

export const registerCompletionProvider = (provider: CompletionProvider): Disposable => {
  const registeredProvider = registry.registerProvider(provider)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
    },
  }
}

export const executeCompletionProvider = async (
  textDocument: TextDocument,
  offset: number,
  ...args: readonly unknown[]
): Promise<readonly CompletionItem[]> => {
  return registry.executeProviderByLanguageId(
    textDocument.languageId,
    'provideCompletions',
    [textDocument, offset, ...args],
    validateCompletionResult,
  )
}

export const executeResolveCompletionItemProvider = async (
  textDocument: TextDocument,
  offset: number,
  name: string,
  completionItem: CompletionItem,
  ...args: readonly unknown[]
): Promise<CompletionItem | undefined> => {
  const provider = registry.getProviderByLanguageId(textDocument.languageId)
  if (!provider) {
    throw new ExtensionApiError(`No completion provider found for ${textDocument.languageId}`)
  }
  return provider.resolveCompletionItem?.(textDocument, offset, name, completionItem, ...args)
}

export const getCompletionProviders = registry.getProviders

export const getCompletionProviderRegistrySnapshot = (): CompletionProviderRegistrySnapshot => {
  return {
    providers: registry.getProviders(),
  }
}

export const resetCompletionProviderRegistry = registry.reset
