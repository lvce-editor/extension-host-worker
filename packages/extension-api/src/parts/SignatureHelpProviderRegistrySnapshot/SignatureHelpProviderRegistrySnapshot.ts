export interface SignatureHelpProviderRegistrySnapshot {
  readonly providers: readonly {
    readonly id: string
    readonly languageId: string
  }[]
}
