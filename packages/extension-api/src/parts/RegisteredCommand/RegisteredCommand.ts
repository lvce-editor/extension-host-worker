export interface RegisteredCommand {
  execute(...args: readonly unknown[]): unknown | Promise<unknown>
  readonly id: string
}
