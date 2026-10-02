import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-completion-provider-prototype-pollution'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const completions = (await Command.execute('ExtensionHost.executeCommand', 'isolatedCompletionPrototypePollution.getCompletions')) as Array<
    Record<string, unknown>
  >
  const completion = completions[0]
  if (!completion || completion.label !== 'prototype completion') {
    throw new Error(`Expected completion carrying __proto__ as data, got ${JSON.stringify(completions)}`)
  }
  if (!Object.hasOwn(completion, '__proto__')) {
    throw new Error('Expected completion to preserve its own __proto__ data property')
  }
  if (Object.getPrototypeOf(completion) !== Object.prototype || (Object.prototype as { polluted?: boolean }).polluted) {
    throw new Error('Completion payload changed an object prototype')
  }

  const cleanCompletions = (await Command.execute('ExtensionHost.executeCommand', 'isolatedCompletionPrototypePollution.getCompletions')) as Array<
    Record<string, unknown>
  >
  if (cleanCompletions[0]?.label !== 'clean completion') {
    throw new Error(`Expected a clean completion after the prototype payload, got ${JSON.stringify(cleanCompletions)}`)
  }
}
