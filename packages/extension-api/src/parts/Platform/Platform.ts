import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export type Platform = 'electron' | 'remote' | 'test' | 'web'

export const getPlatform = async (): Promise<Platform> => {
  const platform = await executeCommand('Layout.getPlatform')
  switch (platform) {
    case 1:
      return 'web'
    case 2:
      return 'electron'
    case 3:
      return 'remote'
    case 4:
      return 'test'
    default:
      throw new TypeError(`Unknown platform: ${platform}`)
  }
}
