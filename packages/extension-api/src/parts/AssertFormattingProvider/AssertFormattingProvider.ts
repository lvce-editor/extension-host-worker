import type { FormattingProvider } from '../FormattingProvider/FormattingProvider.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { hasFormattingProvider } from '../FormattingProviderState/FormattingProviderState.ts'

export const assertFormattingProvider = (provider: FormattingProvider): void => {
  if (!provider) {
    throw new ExtensionApiError('formatting provider is not defined')
  }
  if (typeof provider.id !== 'string' || provider.id.length === 0) {
    throw new ExtensionApiError('formatting provider is missing id')
  }
  if (typeof provider.languageId !== 'string' || provider.languageId.length === 0) {
    throw new ExtensionApiError(`formatting provider ${provider.id} is missing languageId`)
  }
  if (typeof provider.format !== 'function') {
    throw new ExtensionApiError(`formatting provider ${provider.id} is missing format function`)
  }
  if (hasFormattingProvider(provider.id)) {
    throw new ExtensionApiError(`formatting provider ${provider.id} is already registered`)
  }
}
