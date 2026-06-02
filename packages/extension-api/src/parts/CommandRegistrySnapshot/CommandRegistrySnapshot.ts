import type { RegisteredCommand } from '../RegisteredCommand/RegisteredCommand.ts'

export interface CommandRegistrySnapshot {
  readonly commands: readonly RegisteredCommand[]
}
