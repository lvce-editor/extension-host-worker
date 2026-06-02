import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-completion-provider-direct'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)
  const completions = await Command.execute(
    'Extensions.executeCompletionProvider',
    {
      languageId: 'javascript',
      text: 'const value',
      uri: '/test.js',
    },
    5,
  )

  const completion = completions[0]
  if (!completion || completion.label !== 'const value:5' || completion.type !== 1) {
    throw new Error(`Expected isolated completion result, got ${JSON.stringify(completions)}`)
  }
}
