import { beforeEach, expect, jest, test } from '@jest/globals'

const extensionManagementInvoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
const rendererInvoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  ExtensionManagementWorker: {
    invoke: extensionManagementInvoke,
  },
  RendererWorker: {
    invoke: rendererInvoke,
  },
}))

const ExecuteCommand = await import('../src/parts/ExecuteCommand/ExecuteCommand.ts')
const ExtensionHostCommand = await import('../src/parts/ExtensionHostCommand/ExtensionHostCommand.ts')
const ExtensionHostStatusBar = await import('../src/parts/ExtensionHostStatusBar/ExtensionHostStatusBar.ts')

const commandNotFound = (): Error => {
  const error = new Error('command not found')
  error.name = 'CommandNotFoundError'
  return error
}

beforeEach(() => {
  jest.resetAllMocks()
  ExtensionHostCommand.reset()
})

test('executes an isolated extension command', async () => {
  extensionManagementInvoke.mockResolvedValue('isolated result')

  await expect(ExecuteCommand.executeCommand('git.stage', 'file.txt')).resolves.toBe('isolated result')

  expect(extensionManagementInvoke).toHaveBeenCalledWith('Extensions.executeCommand', 'git.stage', 'file.txt')
  expect(rendererInvoke).not.toHaveBeenCalled()
})

test('executes a status bar command through the shared command dispatcher', async () => {
  extensionManagementInvoke.mockResolvedValue(undefined)

  await ExtensionHostStatusBar.executeCommand('git.checkout')

  expect(extensionManagementInvoke).toHaveBeenCalledWith('Extensions.executeCommand', 'git.checkout')
})

test('falls back to a registered legacy extension command', async () => {
  extensionManagementInvoke.mockRejectedValue(commandNotFound())
  const execute = jest.fn((_argument: string) => 'legacy result')
  ExtensionHostCommand.registerCommand({
    execute,
    id: 'legacy.run',
  })

  await expect(ExecuteCommand.executeCommand('legacy.run', 'argument')).resolves.toBe('legacy result')

  expect(execute).toHaveBeenCalledWith('argument')
  expect(rendererInvoke).not.toHaveBeenCalled()
})

test('falls back to a renderer command', async () => {
  extensionManagementInvoke.mockRejectedValue(commandNotFound())
  rendererInvoke.mockResolvedValue('renderer result')

  await expect(ExecuteCommand.executeCommand('Layout.toggleSideBar')).resolves.toBe('renderer result')

  expect(rendererInvoke).toHaveBeenCalledWith('Layout.toggleSideBar')
})

test('preserves extension command errors', async () => {
  const error = new TypeError('extension failed')
  extensionManagementInvoke.mockRejectedValue(error)

  await expect(ExecuteCommand.executeCommand('git.stage')).rejects.toBe(error)

  expect(rendererInvoke).not.toHaveBeenCalled()
})
