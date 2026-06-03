export interface CompletionProviderRegistrySnapshot {
  readonly providers: readonly {
    readonly id: string
    readonly languageId: string
  }[]
}
