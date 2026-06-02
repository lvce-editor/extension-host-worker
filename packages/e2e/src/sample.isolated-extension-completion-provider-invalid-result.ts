import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-completion-provider-invalid-result'

export const skip = true

const expectCommandToThrow = async (Command: any, expectedMessage: string): Promise<void> => {
  try {
    await Command.execute(
      'Extensions.executeCompletionProvider',
      {
        languageId: 'javascript',
        text: 'const value',
        uri: '/test.js',
      },
      0,
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes(expectedMessage)) {
      return
    }
    throw error
  }
  throw new Error(`Expected completion provider to throw ${expectedMessage}`)
}

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await expectCommandToThrow(Command, 'invalid completion result: completion must be of type array but is number')
}
