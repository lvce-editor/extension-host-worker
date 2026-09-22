import { rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeSourceControlGetCurrentBranch,
  executeSourceControlGetDefaultCommitMessage,
  executeSourceControlGetFileBeforeUri,
  executeSourceControlGetProgress,
  registerSourceControlProvider,
  resetSourceControlProviderRegistry,
} from '../../../src/parts/SourceControlProviderRegistry/SourceControlProviderRegistry.ts'

afterEach(() => {
  resetSourceControlProviderRegistry()
})

test('executeSourceControlGetFileBeforeUri uses the provider uri', async () => {
  registerSourceControlProvider({
    getChangedFiles() {
      return []
    },
    getFileBeforeUri(uri) {
      return `git-file-before://${uri}`
    },
    id: 'git',
  })

  strictEqual(await executeSourceControlGetFileBeforeUri('git', 'file:///workspace/file.txt'), 'git-file-before://file:///workspace/file.txt')
})

test('executeSourceControlGetFileBeforeUri wraps legacy content in a data uri', async () => {
  registerSourceControlProvider({
    getChangedFiles() {
      return []
    },
    getFileBefore() {
      return 'before content'
    },
    id: 'legacy',
  })

  strictEqual(await executeSourceControlGetFileBeforeUri('legacy', 'file:///workspace/file.txt'), 'data://before content')
})

test('executeSourceControlGetFileBeforeUri rejects invalid legacy content', async () => {
  registerSourceControlProvider({
    getChangedFiles() {
      return []
    },
    getFileBefore() {
      return {}
    },
    id: 'legacy',
  })

  await rejects(
    executeSourceControlGetFileBeforeUri('legacy', 'file:///workspace/file.txt'),
    /source control provider legacy returned an invalid getFileBefore result/,
  )
})

test('registerSourceControlProvider rejects an invalid getFileBeforeUri', () => {
  throws(() => {
    registerSourceControlProvider({
      getChangedFiles() {
        return []
      },
      // @ts-expect-error testing invalid provider shape
      getFileBeforeUri: 'git-file-before://',
      id: 'git',
    })
  }, /source control provider git has invalid getFileBeforeUri function/)
})

test('progress reflects the current provider state on every query', async () => {
  let busy = true
  registerSourceControlProvider({
    getChangedFiles: () => [],
    getProgress: async () => busy,
    id: 'git',
  })
  strictEqual(await executeSourceControlGetProgress('git'), true)
  busy = false
  strictEqual(await executeSourceControlGetProgress('git'), false)
})

test('providers without progress support are idle', async () => {
  registerSourceControlProvider({ getChangedFiles: () => [], id: 'legacy' })
  strictEqual(await executeSourceControlGetProgress('legacy'), false)
})

test('current branch is optional provider metadata', async () => {
  registerSourceControlProvider({
    getChangedFiles: () => [],
    getCurrentBranch: async (cwd) => `feature/test:${cwd}`,
    id: 'git',
  })
  strictEqual(await executeSourceControlGetCurrentBranch('git', '/test/workspace'), 'feature/test:/test/workspace')
})

test('providers without current branch metadata return undefined', async () => {
  registerSourceControlProvider({ getChangedFiles: () => [], id: 'legacy' })
  strictEqual(await executeSourceControlGetCurrentBranch('legacy', '/test/workspace'), undefined)
})

test('default commit message is optional provider metadata', async () => {
  registerSourceControlProvider({
    getChangedFiles: () => [],
    getDefaultCommitMessage: async (cwd) => `Merge branch into ${cwd}`,
    id: 'git',
  })
  strictEqual(await executeSourceControlGetDefaultCommitMessage('git', '/test/workspace'), 'Merge branch into /test/workspace')
})

test('providers without default commit message metadata return undefined', async () => {
  registerSourceControlProvider({ getChangedFiles: () => [], id: 'legacy' })
  strictEqual(await executeSourceControlGetDefaultCommitMessage('legacy', '/test/workspace'), undefined)
})

test('progress errors propagate and disposed providers cannot be queried', async () => {
  const handle = registerSourceControlProvider({
    getChangedFiles: () => [],
    getProgress: async () => {
      throw new Error('unavailable')
    },
    id: 'git',
  })
  await rejects(executeSourceControlGetProgress('git'), /unavailable/)
  handle.dispose()
  await rejects(executeSourceControlGetProgress('git'), /not found/)
})

test('registration rejects an invalid progress method', () => {
  throws(
    () =>
      registerSourceControlProvider({
        getChangedFiles: () => [],
        // @ts-expect-error testing invalid provider shape
        getProgress: true,
        id: 'git',
      }),
    /invalid getProgress function/,
  )
})
