import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-diagnostic-provider-prototype-pollution'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const diagnostics = (await Command.execute('ExtensionHost.executeCommand', 'isolatedDiagnosticPrototypePollution.getDiagnostics')) as Array<
    Record<string, unknown>
  >
  const diagnostic = diagnostics[0]
  if (!diagnostic || diagnostic.message !== 'prototype payload') {
    throw new Error(`Expected diagnostic carrying __proto__ as data, got ${JSON.stringify(diagnostics)}`)
  }
  if (!Object.hasOwn(diagnostic, '__proto__')) {
    throw new Error('Expected diagnostic to preserve its own __proto__ data property')
  }
  if (Object.getPrototypeOf(diagnostic) !== Object.prototype || (Object.prototype as { polluted?: boolean }).polluted) {
    throw new Error('Diagnostic payload changed an object prototype')
  }

  const cleanDiagnostics = (await Command.execute('ExtensionHost.executeCommand', 'isolatedDiagnosticPrototypePollution.getDiagnostics')) as Array<
    Record<string, unknown>
  >
  if (cleanDiagnostics[0]?.message !== 'clean diagnostic') {
    throw new Error(`Expected a clean diagnostic after the prototype payload, got ${JSON.stringify(cleanDiagnostics)}`)
  }
}
