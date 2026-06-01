import type { Disposable } from '../Disposable/Disposable.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

export type CommandCallback<TArgs extends readonly unknown[] = readonly unknown[], TResult = unknown> = (...args: TArgs) => TResult | Promise<TResult>

export interface Command<TArgs extends readonly unknown[] = readonly unknown[], TResult = unknown> {
  readonly execute: CommandCallback<TArgs, TResult>
  readonly id: string
}

export interface CommandRegistrySnapshot {
  readonly commands: readonly RegisteredCommand[]
}

interface RegisteredCommand {
  execute(...args: readonly unknown[]): unknown | Promise<unknown>
  readonly id: string
}

const commands = new Map<string, RegisteredCommand>()

const assertCommand = <TArgs extends readonly unknown[], TResult>(command: Command<TArgs, TResult>): void => {
  if (!command) {
    throw new ExtensionApiError('command is not defined')
  }
  if (typeof command.id !== 'string' || command.id.length === 0) {
    throw new ExtensionApiError('command is missing id')
  }
  if (typeof command.execute !== 'function') {
    throw new ExtensionApiError(`command ${command.id} is missing execute function`)
  }
  if (commands.has(command.id)) {
    throw new ExtensionApiError(`command ${command.id} is already registered`)
  }
}

export const registerCommand = <TArgs extends readonly unknown[], TResult>(command: Command<TArgs, TResult>): Disposable => {
  assertCommand(command)
  commands.set(command.id, {
    execute(...args: readonly unknown[]): TResult | Promise<TResult> {
      return command.execute(...(args as unknown as TArgs))
    },
    id: command.id,
  })
  return {
    dispose(): void {
      commands.delete(command.id)
    },
  }
}

export const getCommandRegistrySnapshot = (): CommandRegistrySnapshot => {
  return {
    commands: [...commands.values()],
  }
}

export const resetCommandRegistry = (): void => {
  commands.clear()
}
