import { beforeEach, expect, jest, test } from '@jest/globals'

const dialogWorkerInvoke = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => {
  return {
    DialogWorker: {
      invoke: dialogWorkerInvoke,
    },
  }
})

const ExtensionHostPrompt = await import('../src/parts/ExtensionHostPrompt/ExtensionHostPrompt.ts')

test('confirms through dialog worker', async () => {
  dialogWorkerInvoke.mockResolvedValueOnce(true as never)

  await expect(ExtensionHostPrompt.confirm('Continue?')).resolves.toBe(true)

  expect(dialogWorkerInvoke).toHaveBeenCalledWith('ConfirmPrompt.prompt', 'Continue?')
})
