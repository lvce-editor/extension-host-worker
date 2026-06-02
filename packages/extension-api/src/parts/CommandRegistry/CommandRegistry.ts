import type { Command } from '../Command/Command.ts'
import type { CommandRegistrySnapshot } from '../CommandRegistrySnapshot/CommandRegistrySnapshot.ts'
import type { Disposable } from '../Disposable/Disposable.ts'
import type { RegisteredCommand } from '../RegisteredCommand/RegisteredCommand.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const commands: Record<string, RegisteredCommand> = Object.create(null)

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
  if (command.id in commands) {
    throw new ExtensionApiError(`command ${command.id} is already registered`)
  }
}

export const registerCommand = <TArgs extends readonly unknown[], TResult>(command: Command<TArgs, TResult>): Disposable => {
  assertCommand(command)
  commands[command.id] = {
    execute(...args: readonly unknown[]): TResult | Promise<TResult> {
      return command.execute(...(args as unknown as TArgs))
    },
    id: command.id,
  }
  return {
    dispose(): void {
      delete commands[command.id]
    },
  }
}

export const getCommandRegistrySnapshot = (): CommandRegistrySnapshot => {
  return {
    commands: Object.values(commands),
  }
}

export const executeCommand = async (id: string, ...args: readonly unknown[]): Promise<unknown> => {
  const command = commands[id]
  if (!command) {
    throw new ExtensionApiError(`command ${id} not found`)
  }
  return command.execute(...args)
}

export const resetCommandRegistry = (): void => {
  for (const id of Object.keys(commands)) {
    delete commands[id]
  }
}
