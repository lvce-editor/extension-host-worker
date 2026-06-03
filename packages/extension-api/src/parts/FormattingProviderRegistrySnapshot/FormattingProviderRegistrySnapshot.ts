export interface FormattingProviderRegistrySnapshot {
  readonly providers: readonly {
    readonly id: string
    readonly languageId: string
  }[]
}
