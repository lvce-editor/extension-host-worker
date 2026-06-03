export interface CommandRegistrySnapshot {
  readonly commands: readonly {
    readonly id: string
  }[]
}
