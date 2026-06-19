import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-output-channel-get-logs'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const logs = await Command.execute('ExtensionHost.executeCommand', 'sample.output.getLogs')
  if (logs !== 'extension started\nready') {
    throw new Error(`Expected output logs to be "extension started\\nready" but got ${JSON.stringify(logs)}`)
  }

  const result = (await Command.execute('ExtensionHost.executeCommand', 'sample.output.replaceAndClear')) as {
    readonly cleared?: unknown
    readonly replaced?: unknown
  }
  if (!result || result.replaced !== 'replacement' || result.cleared !== '') {
    throw new Error(`Expected replace and clear result but got ${JSON.stringify(result)}`)
  }
}
