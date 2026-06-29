import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-source-control-provider-error'

const expectCommandToThrow = async (Command: any, expectedMessage: string): Promise<void> => {
  try {
    await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControlError.getChangedFiles')
  } catch (error) {
    if (error instanceof Error && error.message.includes(expectedMessage)) {
      return
    }
    throw error
  }
  throw new Error(`Expected source control provider to throw ${expectedMessage}`)
}

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await expectCommandToThrow(Command, 'isolated source control failed')
}
