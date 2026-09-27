import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-confirm-prompt'

export const test: Test = async ({ Dialog, Extension, QuickPick }) => {
  let promptCount = 0
  await Dialog.mockConfirm(() => {
    promptCount++
    return promptCount !== 2
  })
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  await QuickPick.open()
  await QuickPick.setValue('>isolatedConfirmPromptSample')
  // @ts-ignore older published test-worker types don't include waitUntil yet
  await QuickPick.selectItem('Isolated Confirm Prompt Sample', { waitUntil: 'quickPick' })

  if (promptCount !== 3) {
    throw new Error(`Expected three prompt calls, got ${promptCount}`)
  }
}
