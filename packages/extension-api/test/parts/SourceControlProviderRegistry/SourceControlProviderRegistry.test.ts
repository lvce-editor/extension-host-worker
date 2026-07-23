import { strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeSourceControlGetFileBeforeUri,
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
