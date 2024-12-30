import * as CommandMap from '@lvce-editor/command'

export const registerCommands = (commandMap) => {
  CommandMap.register(commandMap)
}

export const execute = CommandMap.execute
