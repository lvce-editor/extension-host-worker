import type { DiagnosticProvider } from '../DiagnosticProvider/DiagnosticProvider.ts'
import type { DiagnosticProviderRegistrySnapshot } from '../DiagnosticProviderRegistrySnapshot/DiagnosticProviderRegistrySnapshot.ts'
import type { Diagnostic } from '../DiagnosticResult/DiagnosticResult.ts'
import type { TextDocument } from '../DiagnosticTextDocument/DiagnosticTextDocument.ts'
import type { Disposable } from '../Disposable/Disposable.ts'
import type { RegisteredDiagnosticProvider } from '../RegisteredDiagnosticProvider/RegisteredDiagnosticProvider.ts'
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

const validateDiagnosticResult = (diagnostics: unknown): readonly Diagnostic[] => {
  if (!Array.isArray(diagnostics)) {
    throw new ExtensionApiError(`invalid diagnostic result: diagnostic must be of type array but is ${getType(diagnostics)}`)
  }
  for (const item of diagnostics) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new ExtensionApiError(`invalid diagnostic result: expected diagnostic item to be of type object but was of type ${getType(item)}`)
    }
  }
  return diagnostics
}

const registry = createProviderRegistry<DiagnosticProvider, RegisteredDiagnosticProvider>({
  mapProvider(provider) {
    return {
      id: provider.id,
      languageId: provider.languageId,
      provideDiagnostics(textDocument, ...args) {
        return provider.provideDiagnostics(textDocument, ...args)
      },
    }
  },
  providerName: 'diagnostic provider',
  requiredMethods: ['provideDiagnostics'],
  requireLanguageId: true,
})

export const hasDiagnosticProvider = registry.hasProvider

export const registerDiagnosticProvider = (provider: DiagnosticProvider): Disposable => {
  const registeredProvider = registry.registerProvider(provider)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
    },
  }
}

export const executeDiagnosticProvider = async (textDocument: TextDocument, ...args: readonly unknown[]): Promise<readonly Diagnostic[]> => {
  return registry.executeProviderByLanguageId(textDocument.languageId, 'provideDiagnostics', [textDocument, ...args], validateDiagnosticResult)
}

export const getDiagnosticProviders = registry.getProviders

export const getDiagnosticProviderRegistrySnapshot = (): DiagnosticProviderRegistrySnapshot => {
  return {
    providers: registry.getProviders().map((provider) => ({
      id: provider.id,
      languageId: provider.languageId,
    })),
  }
}

export const resetDiagnosticProviderRegistry = registry.reset
