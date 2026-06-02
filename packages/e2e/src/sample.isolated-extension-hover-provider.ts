import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-hover-provider'

export const skip = true

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  await Command.execute('ExtensionHostTextDocument.syncFull', '/test.xyz', 1, 'xyz', 'sample')

  const hover = await Command.execute('ExtensionHostHover.execute', 1, 0)

  if (JSON.stringify(hover) !== JSON.stringify({ text: 'isolated hover result' })) {
    throw new Error(`Expected hover result to be isolated hover result but got ${JSON.stringify(hover)}`)
  }
}
