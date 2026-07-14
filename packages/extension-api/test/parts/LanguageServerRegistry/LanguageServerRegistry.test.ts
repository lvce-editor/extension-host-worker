import { deepStrictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  getLanguageServerRegistrySnapshot,
  registerLanguageServer,
  resetLanguageServerRegistry,
} from '../../../src/parts/LanguageServerRegistry/LanguageServerRegistry.ts'

afterEach(() => {
  resetLanguageServerRegistry()
})

test('registerLanguageServer exposes serializable process metadata', () => {
  registerLanguageServer({
    argv: ['--lsp', '--stdio'],
    id: 'typescript-native',
    languageId: 'typescript',
    uri: '../../node_modules/typescript/bin/tsc',
  })

  deepStrictEqual(getLanguageServerRegistrySnapshot(), {
    languageServers: [
      {
        argv: ['--lsp', '--stdio'],
        id: 'typescript-native',
        languageId: 'typescript',
        uri: '../../node_modules/typescript/bin/tsc',
      },
    ],
  })
})

test('registerLanguageServer returns a disposable registration', () => {
  const disposable = registerLanguageServer({ argv: [], id: 'sample', languageId: 'xyz', uri: 'server' })
  disposable.dispose()
  deepStrictEqual(getLanguageServerRegistrySnapshot(), { languageServers: [] })
})

test('registerLanguageServer rejects invalid registrations', () => {
  throws(() => registerLanguageServer(undefined as never), /language server is not defined/)
  throws(() => registerLanguageServer({ argv: [], id: '', languageId: 'xyz', uri: 'server' }), /language server is missing id/)
  throws(
    () => registerLanguageServer({ argv: [1] as never, id: 'sample', languageId: 'xyz', uri: 'server' }),
    /language server sample has invalid argv/,
  )
})

test('registerLanguageServer rejects duplicate ids', () => {
  const options = { argv: [], id: 'sample', languageId: 'xyz', uri: 'server' }
  registerLanguageServer(options)
  throws(() => registerLanguageServer(options), /language server sample is already registered/)
})
