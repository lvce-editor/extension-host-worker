export interface HoverProviderRegistrySnapshot {
  readonly providers: readonly {
    readonly id: string
    readonly languageId: string
  }[]
}
