import type { Disposable } from '../Disposable/Disposable.ts'
import type { FormattingEdit } from '../FormattingEdit/FormattingEdit.ts'
import type { FormattingProvider } from '../FormattingProvider/FormattingProvider.ts'
import type { FormattingProviderRegistrySnapshot } from '../FormattingProviderRegistrySnapshot/FormattingProviderRegistrySnapshot.ts'
import type { TextDocument } from '../FormattingTextDocument/FormattingTextDocument.ts'
import type { RegisteredFormattingProvider } from '../RegisteredFormattingProvider/RegisteredFormattingProvider.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

const registry = createProviderRegistry<FormattingProvider, RegisteredFormattingProvider>({
  mapProvider(provider) {
    return {
      format(textDocument, ...args) {
        return provider.format(textDocument, ...args)
      },
      id: provider.id,
      languageId: provider.languageId,
    }
  },
  providerName: 'formatting provider',
  requiredMethods: ['format'],
  requireLanguageId: true,
})

export const hasFormattingProvider = registry.hasProvider

export const registerFormattingProvider = (provider: FormattingProvider): Disposable => {
  const registeredProvider = registry.registerProvider(provider)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
    },
  }
}

export const executeFormattingProvider = async (textDocument: TextDocument, ...args: readonly unknown[]): Promise<readonly FormattingEdit[]> => {
  return registry.executeProviderByLanguageId(textDocument.languageId, 'format', [textDocument, ...args])
}

export const getFormattingProviders = registry.getProviders

export const getFormattingProviderRegistrySnapshot = (): FormattingProviderRegistrySnapshot => {
  return {
    providers: registry.getProviders().map((provider) => ({
      id: provider.id,
      languageId: provider.languageId,
    })),
  }
}

export const resetFormattingProviderRegistry = registry.reset
