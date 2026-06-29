import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-source-control-provider-not-contributed'

const expectCommandToThrow = async (Command: any, expectedMessage: string): Promise<void> => {
  try {
    await Command.execute('ExtensionHost.executeCommand', 'isolatedSourceControlMissingContribution.activate')
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
  await expectCommandToThrow(
    Command,
    'source control provider isolatedSourceControlMissingContribution is registered but not contributed in extension.json',
  )
}
