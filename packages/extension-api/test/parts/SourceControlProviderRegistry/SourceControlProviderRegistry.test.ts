import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  acceptInput,
  add,
  discard,
  generateCommitMessage,
  getChangedFiles,
  getEnabledProviderIds,
  getFeatures,
  getFileBefore,
  getFileDecorations,
  getGroups,
  getSourceControlProviderRegistrySnapshot,
  registerSourceControlProvider,
  resetSourceControlProviderRegistry,
} from '../../../src/parts/SourceControlProviderRegistry/SourceControlProviderRegistry.ts'

afterEach(() => {
  resetSourceControlProviderRegistry()
})

test('getChangedFiles returns files from matching provider', async () => {
  registerSourceControlProvider({
    getChangedFiles() {
      return [{ file: '/test/file.txt', status: 1 }]
    },
    id: 'sample.source-control',
  })

  deepStrictEqual(await getChangedFiles('sample.source-control'), [{ file: '/test/file.txt', status: 1 }])
})

test('getFileBefore returns previous file content', async () => {
  registerSourceControlProvider({
    getFileBefore(uri) {
      return `before:${uri}`
    },
    id: 'sample.source-control',
  })

  strictEqual(await getFileBefore('sample.source-control', '/test/file.txt'), 'before:/test/file.txt')
})

test('getGroups returns groups from provider', async () => {
  registerSourceControlProvider({
    getGroups(cwd) {
      return [
        {
          id: 'staged',
          items: [{ file: `${cwd}/file.txt`, status: 1 }],
          label: 'Staged',
        },
      ]
    },
    id: 'sample.source-control',
  })

  deepStrictEqual(await getGroups('sample.source-control', '/workspace'), [
    {
      id: 'staged',
      items: [{ file: '/workspace/file.txt', status: 1 }],
      label: 'Staged',
    },
  ])
})

test('getGroups falls back to getChangedFiles', async () => {
  registerSourceControlProvider({
    getChangedFiles() {
      return [{ file: '/workspace/file.txt', status: 1 }]
    },
    id: 'sample.source-control',
  })

  deepStrictEqual(await getGroups('sample.source-control', '/workspace'), [
    {
      id: 'changes',
      items: [{ file: '/workspace/file.txt', status: 1 }],
      label: 'Changes',
    },
  ])
})

test('acceptInput, add and discard call provider methods', async () => {
  const calls: string[] = []
  registerSourceControlProvider({
    acceptInput(value) {
      calls.push(`input:${value}`)
    },
    add(path) {
      calls.push(`add:${path}`)
    },
    discard(path) {
      calls.push(`discard:${path}`)
    },
    id: 'sample.source-control',
  })

  await acceptInput('sample.source-control', 'feat: sample')
  await add('/workspace/file.txt')
  await discard('/workspace/file.txt')

  deepStrictEqual(calls, ['input:feat: sample', 'add:/workspace/file.txt', 'discard:/workspace/file.txt'])
})

test('generateCommitMessage returns generated message', async () => {
  registerSourceControlProvider({
    generateCommitMessage() {
      return 'feat: generated message'
    },
    id: 'sample.source-control',
  })

  strictEqual(await generateCommitMessage('sample.source-control'), 'feat: generated message')
})

test('generateCommitMessage rejects missing function', async () => {
  registerSourceControlProvider({
    id: 'sample.source-control',
  })

  await rejects(() => generateCommitMessage('sample.source-control'), /source control provider is missing required function generateCommitMessage/)
})

test('getFeatures uses getFeatures function', async () => {
  registerSourceControlProvider({
    getFeatures() {
      return {
        showGenerateCommitMessageButton: true,
      }
    },
    id: 'sample.source-control',
  })

  deepStrictEqual(await getFeatures('sample.source-control'), {
    showGenerateCommitMessageButton: true,
  })
})

test('getFeatures uses features object', async () => {
  registerSourceControlProvider({
    features: {
      showGenerateCommitMessageButton: false,
    },
    id: 'sample.source-control',
  })

  deepStrictEqual(await getFeatures('sample.source-control'), {
    showGenerateCommitMessageButton: false,
  })
})

test('getFeatures uses showGenerateCommitMessageButton fallback', async () => {
  registerSourceControlProvider({
    id: 'sample.source-control',
    showGenerateCommitMessageButton: true,
  })

  deepStrictEqual(await getFeatures('sample.source-control'), {
    showGenerateCommitMessageButton: true,
  })
})

test('getEnabledProviderIds returns active provider ids', async () => {
  registerSourceControlProvider({
    id: 'sample.inactive',
    isActive() {
      return false
    },
  })
  registerSourceControlProvider({
    id: 'sample.active',
    isActive(scheme, root) {
      return scheme === 'file' && root === '/workspace'
    },
  })

  deepStrictEqual(await getEnabledProviderIds('file', '/workspace'), ['sample.active'])
})

test('getFileDecorations returns provider decorations', async () => {
  registerSourceControlProvider({
    getFileDecorations(uris) {
      return uris.map((uri) => ({
        color: 'modified',
        uri,
      }))
    },
    id: 'sample.source-control',
  })

  deepStrictEqual(await getFileDecorations('sample.source-control', ['/workspace/file.txt']), [
    {
      color: 'modified',
      uri: '/workspace/file.txt',
    },
  ])
})

test('getFileDecorations returns empty array when provider has no decorations', async () => {
  registerSourceControlProvider({
    id: 'sample.source-control',
  })

  deepStrictEqual(await getFileDecorations('sample.source-control', ['/workspace/file.txt']), [])
})

test('registerSourceControlProvider disposes provider', () => {
  const disposable = registerSourceControlProvider({
    id: 'sample.source-control',
  })

  strictEqual(getSourceControlProviderRegistrySnapshot().providers.length, 1)
  disposable.dispose()
  strictEqual(getSourceControlProviderRegistrySnapshot().providers.length, 0)
})

test('registerSourceControlProvider rejects duplicate id', () => {
  registerSourceControlProvider({
    id: 'sample.source-control',
  })

  throws(() => {
    registerSourceControlProvider({
      id: 'sample.source-control',
    })
  }, /source control provider sample\.source-control is already registered/)
})

test('registerSourceControlProvider rejects missing id', () => {
  throws(() => {
    registerSourceControlProvider({
      // @ts-expect-error testing invalid provider shape
      id: undefined,
    })
  }, /source control provider is missing id/)
})

test('registerSourceControlProvider rejects invalid optional method', () => {
  throws(() => {
    registerSourceControlProvider({
      // @ts-expect-error testing invalid provider shape
      getChangedFiles: 'nope',
      id: 'sample.source-control',
    })
  }, /source control provider sample\.source-control has invalid getChangedFiles function/)
})

test('getSourceControlProviderRegistrySnapshot returns registered providers', () => {
  registerSourceControlProvider({
    id: 'sample.source-control',
  })

  deepStrictEqual(
    getSourceControlProviderRegistrySnapshot().providers.map((provider) => provider.id),
    ['sample.source-control'],
  )
})
