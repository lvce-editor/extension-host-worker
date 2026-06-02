import { clearFormattingProviders } from '../FormattingProviderState/FormattingProviderState.ts'

export const resetFormattingProviderRegistry = (): void => {
  clearFormattingProviders()
}
