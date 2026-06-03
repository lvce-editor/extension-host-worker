export interface DiagnosticProviderRegistrySnapshot {
  readonly providers: readonly {
    readonly id: string
    readonly languageId: string
  }[]
}
