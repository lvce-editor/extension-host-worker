import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-diagnostic-provider-not-contributed'

export const skip = true

const expectAddWebExtensionToThrow = async (Extension: any, uri: string, expectedMessage: string): Promise<void> => {
  try {
    await Extension.addWebExtension(uri)
  } catch (error) {
    if (error instanceof Error && error.message.includes(expectedMessage)) {
      return
    }
    throw error
  }
  throw new Error(`Expected addWebExtension to throw ${expectedMessage}`)
}

export const test: Test = async ({ Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await expectAddWebExtensionToThrow(
    Extension,
    uri,
    'diagnostic provider isolatedDiagnosticMissingContribution is registered but not contributed in extension.json',
  )
}
