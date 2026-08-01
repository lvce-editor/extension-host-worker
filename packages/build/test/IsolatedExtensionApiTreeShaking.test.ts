import { doesNotMatch, match } from 'node:assert/strict'
import { before, test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execa } from 'execa'
import { root } from '../src/root.ts'

const bundleDir = join(root, '.tmp', 'benchmark', 'bundles')

const readBundle = (id: string): Promise<string> => {
  return readFile(join(bundleDir, `${id}.js`), 'utf8')
}

before(async () => {
  await execa('node', ['packages/build/src/benchmark-isolated-extension-api-size.ts'], {
    cwd: root,
  })
})

test('activate-only bundle excludes optional extension api command families', async () => {
  const bundle = await readBundle('baseline')
  match(bundle, /ExtensionApi\.getStatusBarItems/)
  doesNotMatch(bundle, /ExtensionApi\.executeCompletionProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeDiagnosticProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeFileSystemProviderReadFile/)
  doesNotMatch(bundle, /ExtensionApi\.executeFormattingProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeHoverProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeLanguageProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeSignatureHelpProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeSourceControlGetChangedFiles/)
  doesNotMatch(bundle, /ExtensionApi\.executeViewProvider/)
  doesNotMatch(bundle, /ExtensionHostDebug\.evaluate/)
})

test('completion bundle includes completion commands only', async () => {
  const bundle = await readBundle('completion')
  match(bundle, /ExtensionApi\.executeCompletionProvider/)
  match(bundle, /ExtensionApi\.executeResolveCompletionItemProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeHoverProvider/)
  doesNotMatch(bundle, /ExtensionHostDebug\.evaluate/)
})

test('hover bundle includes hover commands only', async () => {
  const bundle = await readBundle('hover')
  match(bundle, /ExtensionApi\.executeHoverProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeCompletionProvider/)
  doesNotMatch(bundle, /ExtensionHostDebug\.evaluate/)
})

test('debug bundle includes debug commands only', async () => {
  const bundle = await readBundle('debug')
  match(bundle, /ExtensionHostDebug\.evaluate/)
  match(bundle, /ExtensionHostDebug\.stepOver/)
  doesNotMatch(bundle, /ExtensionApi\.executeCompletionProvider/)
  doesNotMatch(bundle, /ExtensionApi\.executeHoverProvider/)
})

test('output-channel bundle includes its output channel commands only', async () => {
  const bundle = await readBundle('output-channel')
  match(bundle, /ExtensionApi\.clearOutputChannel/)
  match(bundle, /ExtensionApi\.getOutputChannelLogs/)
  match(bundle, /ExtensionApi\.getOutputChannelRegistrySnapshot/)
  doesNotMatch(bundle, /ExtensionApi\.executeCompletionProvider/)
  doesNotMatch(bundle, /ExtensionHostDebug\.evaluate/)
})
