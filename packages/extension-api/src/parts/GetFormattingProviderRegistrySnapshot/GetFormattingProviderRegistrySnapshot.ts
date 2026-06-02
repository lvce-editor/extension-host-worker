import type { FormattingProviderRegistrySnapshot } from '../FormattingProviderRegistrySnapshot/FormattingProviderRegistrySnapshot.ts'
import { getFormattingProviders } from '../FormattingProviderState/FormattingProviderState.ts'

export const getFormattingProviderRegistrySnapshot = (): FormattingProviderRegistrySnapshot => {
  return {
    providers: getFormattingProviders(),
  }
}
