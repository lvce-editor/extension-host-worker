import type { Disposable } from '../Disposable/Disposable.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

export interface LanguageProvider {
  readonly id: string
  readonly languageId: string
  readonly [key: string]: unknown
}

type ProviderMethod = (...args: readonly unknown[]) => unknown

const providers: Record<string, LanguageProvider[]> = Object.create(null)

const getProvider = (kind: string, languageId: string): LanguageProvider | undefined => {
  return providers[kind]?.find((provider) => provider.languageId === languageId)
}

const registerProvider = (kind: string, provider: LanguageProvider, requiredMethods: readonly string[]): Disposable => {
  if (!provider || typeof provider !== 'object') {
    throw new ExtensionApiError(`${kind} provider is not defined`)
  }
  if (typeof provider.id !== 'string' || provider.id.length === 0) {
    throw new ExtensionApiError(`${kind} provider is missing id`)
  }
  if (typeof provider.languageId !== 'string' || provider.languageId.length === 0) {
    throw new ExtensionApiError(`${kind} provider ${provider.id} is missing languageId`)
  }
  for (const methodName of requiredMethods) {
    if (typeof provider[methodName] !== 'function') {
      throw new ExtensionApiError(`${kind} provider ${provider.id} is missing ${methodName} function`)
    }
  }
  const kindProviders = (providers[kind] ||= [])
  if (kindProviders.some((registeredProvider) => registeredProvider.id === provider.id)) {
    throw new ExtensionApiError(`${kind} provider ${provider.id} is already registered`)
  }
  kindProviders.push(provider)
  return {
    dispose(): void {
      const index = kindProviders.indexOf(provider)
      if (index !== -1) {
        kindProviders.splice(index, 1)
      }
    },
  }
}

export const executeLanguageProvider = async (
  kind: string,
  methodName: string,
  textDocument: { readonly languageId: string },
  ...args: readonly unknown[]
): Promise<unknown> => {
  const provider = getProvider(kind, textDocument.languageId)
  if (!provider) {
    throw new ExtensionApiError(`No ${kind} provider found for ${textDocument.languageId}`)
  }
  const method = provider[methodName]
  if (typeof method !== 'function') {
    throw new ExtensionApiError(`${kind} provider ${provider.id} is missing ${methodName} function`)
  }
  return (method as ProviderMethod)(textDocument, ...args)
}

export const executeOrganizeImportsProvider = async (textDocument: { readonly languageId: string }): Promise<unknown> => {
  const provider = getProvider('code action', textDocument.languageId)
  if (!provider) {
    throw new ExtensionApiError(`No code action provider found for ${textDocument.languageId}`)
  }
  const provideCodeActions = provider.provideCodeActions as ProviderMethod
  const actions = await provideCodeActions(textDocument)
  if (!Array.isArray(actions)) {
    throw new ExtensionApiError('invalid code action result: code actions must be of type array')
  }
  const action = actions.find((candidate) => candidate && typeof candidate === 'object' && candidate.kind === 'source.organizeImports')
  if (!action || typeof action.execute !== 'function') {
    return []
  }
  return action.execute(textDocument)
}

export const registerBraceCompletionProvider = (provider: LanguageProvider): Disposable =>
  registerProvider('brace completion', provider, ['provideBraceCompletion'])
export const registerClosingTagProvider = (provider: LanguageProvider): Disposable => registerProvider('closing tag', provider, ['provideClosingTag'])
export const registerCodeActionsProvider = (provider: LanguageProvider): Disposable =>
  registerProvider('code action', provider, ['provideCodeActions'])
export const registerCommentProvider = (provider: LanguageProvider): Disposable => registerProvider('comment', provider, ['provideComment'])
export const registerDefinitionProvider = (provider: LanguageProvider): Disposable => registerProvider('definition', provider, ['provideDefinition'])
export const registerImplementationProvider = (provider: LanguageProvider): Disposable =>
  registerProvider('implementation', provider, ['provideImplementations'])
export const registerReferenceProvider = (provider: LanguageProvider): Disposable => registerProvider('reference', provider, ['provideReferences'])
export const registerRenameProvider = (provider: LanguageProvider): Disposable => registerProvider('rename', provider, ['provideRename'])
export const registerSelectionProvider = (provider: LanguageProvider): Disposable => registerProvider('selection', provider, ['provideSelections'])
export const registerTabCompletionProvider = (provider: LanguageProvider): Disposable =>
  registerProvider('tab completion', provider, ['provideTabCompletion'])
export const registerTypeDefinitionProvider = (provider: LanguageProvider): Disposable =>
  registerProvider('type definition', provider, ['provideTypeDefinition'])

export const resetLanguageProviderRegistry = (): void => {
  for (const kind of Object.keys(providers)) {
    delete providers[kind]
  }
}
