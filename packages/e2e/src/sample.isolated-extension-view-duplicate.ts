import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-view-duplicate'

export const skip = true

const expectAddWebExtensionToThrow = async (Extension: any, uri: string, expectedMessage: string): Promise<void> => {
  try {
    await Extension.addWebExtension(uri)
    throw new Error('expected extension activation to fail')
  } catch (error) {
    if (error instanceof Error && error.message.includes(expectedMessage)) {
      return
    }
    throw error
  }
}

export const test: Test = async ({ Extension }) => {
  const uri = new URL(`../fixtures/${name}`, import.meta.url).toString()
  await expectAddWebExtensionToThrow(Extension, uri, 'view sample.views.duplicate is contributed multiple times')
}
