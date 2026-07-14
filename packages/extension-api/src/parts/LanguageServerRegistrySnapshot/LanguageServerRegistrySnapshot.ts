import type { LanguageServerOptions } from '../LanguageServerOptions/LanguageServerOptions.ts'

export interface LanguageServerRegistrySnapshot {
  readonly languageServers: readonly LanguageServerOptions[]
}
