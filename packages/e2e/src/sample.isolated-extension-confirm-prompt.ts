import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-confirm-prompt'

export const test: Test = async ({ Command, Dialog, Extension }) => {
  const prompts: Array<{ message: string; options: Record<string, string> }> = []
  // @ts-ignore older published test-worker types omit the runtime mock callback arguments
  await Dialog.mockConfirm((message: string, options: Record<string, string>) => {
    prompts.push({ message, options })
    return false
  })
  const uri = import.meta.resolve('../fixtures/sample.isolated-extension-api-coverage')
  await Extension.addWebExtension(uri)
  const confirmed = await Command.execute('ExtensionHost.executeCommand', 'isolatedApiCoverage.run', 'host-confirm-prompt')
  if (confirmed !== false) {
    throw new Error(`Expected confirm cancellation, got ${JSON.stringify(confirmed)}`)
  }

  if (prompts.length !== 1) {
    throw new Error(`Expected one prompt call, got ${JSON.stringify(prompts)}`)
  }
  const [prompt] = prompts
  if (
    prompt.message !== 'Continue?' ||
    prompt.options.cancelMessage !== 'Cancel' ||
    prompt.options.confirmMessage !== 'Continue' ||
    prompt.options.title !== 'WSL'
  ) {
    throw new Error(`Unexpected prompt call: ${JSON.stringify(prompt)}`)
  }
}
