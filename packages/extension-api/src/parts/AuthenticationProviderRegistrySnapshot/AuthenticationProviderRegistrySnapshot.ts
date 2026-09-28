export interface AuthenticationProviderRegistrySnapshot {
  readonly providers: readonly {
    readonly id: string
    readonly label: string
  }[]
}
