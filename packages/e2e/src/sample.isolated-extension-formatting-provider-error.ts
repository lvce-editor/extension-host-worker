import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-formatting-provider-error'

export const skip = true

const expectCommandToThrow = async (Command: any, expectedMessage: string): Promise<void> => {
  try {
    await Command.execute('ExtensionHostFormatting.executeFormattingProvider', 1)
  } catch (error) {
    if (error instanceof Error && error.message.includes(expectedMessage)) {
      return
    }
    throw error
  }
  throw new Error(`Expected formatting provider to throw ${expectedMessage}`)
}

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await Command.execute('ExtensionHostTextDocument.syncFull', '/test.js', 1, 'javascript', 'const value=1')
  await expectCommandToThrow(Command, 'Failed to execute formatting provider: isolated formatting failed')
}
