import type { Disposable } from '../Disposable/Disposable.ts'
import type { RegisteredSignatureHelpProvider } from '../RegisteredSignatureHelpProvider/RegisteredSignatureHelpProvider.ts'
import type { SignatureHelpProvider } from '../SignatureHelpProvider/SignatureHelpProvider.ts'
import type { SignatureHelpProviderRegistrySnapshot } from '../SignatureHelpProviderRegistrySnapshot/SignatureHelpProviderRegistrySnapshot.ts'
import type { SignatureHelpResult } from '../SignatureHelpResult/SignatureHelpResult.ts'
import type { TextDocument } from '../SignatureHelpTextDocument/SignatureHelpTextDocument.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
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

const validateSignatureHelpResult = (signatureHelp: unknown): SignatureHelpResult | undefined => {
  if (signatureHelp === undefined) {
    return undefined
  }
  if (!signatureHelp || typeof signatureHelp !== 'object' || Array.isArray(signatureHelp)) {
    throw new ExtensionApiError(`invalid signature help result: signature help must be of type object or undefined but is ${getType(signatureHelp)}`)
  }
  return signatureHelp as SignatureHelpResult
}

const registry = createProviderRegistry<SignatureHelpProvider, RegisteredSignatureHelpProvider>({
  mapProvider(provider) {
    return {
      id: provider.id,
      languageId: provider.languageId,
      provideSignatureHelp(textDocument, offset, ...args) {
        return provider.provideSignatureHelp(textDocument, offset, ...args)
      },
    }
  },
  providerName: 'signature help provider',
  requiredMethods: ['provideSignatureHelp'],
  requireLanguageId: true,
})

export const hasSignatureHelpProvider = registry.hasProvider

export const registerSignatureHelpProvider = (provider: SignatureHelpProvider): Disposable => {
  const registeredProvider = registry.registerProvider(provider)
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
    },
  }
}

export const executeSignatureHelpProvider = async (
  textDocument: TextDocument,
  offset: number,
  ...args: readonly unknown[]
): Promise<SignatureHelpResult | undefined> => {
  return registry.executeProviderByLanguageId(
    textDocument.languageId,
    'provideSignatureHelp',
    [textDocument, offset, ...args],
    validateSignatureHelpResult,
  )
}

export const getSignatureHelpProviders = registry.getProviders

export const getSignatureHelpProviderRegistrySnapshot = (): SignatureHelpProviderRegistrySnapshot => {
  return {
    providers: registry.getProviders().map((provider) => ({
      id: provider.id,
      languageId: provider.languageId,
    })),
  }
}

const commandMap = {
  'ExtensionApi.executeSignatureHelpProvider': executeSignatureHelpProvider,
  'ExtensionApi.getSignatureHelpProviderRegistrySnapshot': getSignatureHelpProviderRegistrySnapshot,
}

export const resetSignatureHelpProviderRegistry = registry.reset
