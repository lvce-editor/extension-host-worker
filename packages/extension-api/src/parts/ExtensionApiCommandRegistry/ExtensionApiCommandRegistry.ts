import { register as registerCommands } from '@lvce-editor/command'

export type ExtensionApiCommand = (...args: readonly any[]) => any
export type ExtensionApiCommandMap = Readonly<Record<string, ExtensionApiCommand>>

const commandMap: Record<string, ExtensionApiCommand> = Object.create(null)

export const getCommandMap = (): ExtensionApiCommandMap => {
  return commandMap
}

export const registerCommandMap = (newCommandMap: ExtensionApiCommandMap): void => {
  Object.assign(commandMap, newCommandMap)
  registerCommands(newCommandMap)
}
