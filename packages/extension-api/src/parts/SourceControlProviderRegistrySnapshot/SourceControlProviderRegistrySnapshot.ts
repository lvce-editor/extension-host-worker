export interface SourceControlProviderRegistrySnapshot {
  readonly providers: readonly {
    readonly id: string
  }[]
}
