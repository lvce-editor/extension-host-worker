import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-command-not-registered'

export const skip = true

const expectCommandToThrow = async (Command: any, expectedMessage: string): Promise<void> => {
  try {
    await Command.execute('ExtensionHost.executeCommand', 'isolatedMissingRegistration.run')
  } catch (error) {
    if (error instanceof Error && error.message.includes(expectedMessage)) {
      return
    }
    throw error
  }
  throw new Error(`Expected command to throw ${expectedMessage}`)
}

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await expectCommandToThrow(Command, 'command isolatedMissingRegistration.run is contributed in extension.json but not registered')
}
