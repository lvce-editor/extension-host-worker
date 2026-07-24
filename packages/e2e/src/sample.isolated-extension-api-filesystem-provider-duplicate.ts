import type { Test } from '@lvce-editor/test-with-playwright'

const createTest = (caseName: string, expected: unknown): Test => {
  return async ({ Command, Extension }) => {
    const uri = import.meta.resolve('../fixtures/sample.isolated-extension-api-coverage')
    await Extension.addWebExtension(uri)

    const actual = await Command.execute('ExtensionHost.executeCommand', 'isolatedApiCoverage.run', caseName)
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${caseName} to return ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
    }
  }
}

export const name = 'sample.isolated-extension-api-filesystem-provider-duplicate'
export const test = createTest('filesystem-provider-duplicate', 'file system provider sample-file-system is already registered')
