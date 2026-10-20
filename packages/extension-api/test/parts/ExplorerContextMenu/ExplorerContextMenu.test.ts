import { deepStrictEqual, rejects, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  getExplorerContextMenuEntries,
  registerExplorerContextMenuProvider,
  resetExplorerContextMenuProviders,
} from '../../../src/parts/ExplorerContextMenu/ExplorerContextMenu.ts'

const entry = { command: 'runner.run', id: 'run', label: 'Run' }
afterEach(resetExplorerContextMenuProviders)

test('providers receive the clicked resource and can filter files and folders', async () => {
  const seen: unknown[] = []
  registerExplorerContextMenuProvider({
    id: 'runner',
    provideMenuEntries(context) {
      seen.push(context)
      return !context.isDirectory && context.uri.endsWith('.js') ? [entry] : []
    },
  })
  const context = { isDirectory: false, uri: 'file:///a%20b.js' }
  deepStrictEqual(await getExplorerContextMenuEntries(context), [entry])
  deepStrictEqual(await getExplorerContextMenuEntries({ ...context, isDirectory: true }), [])
  deepStrictEqual(await getExplorerContextMenuEntries({ ...context, uri: 'file:///readme.md' }), [])
  deepStrictEqual(seen[0], context)
})

test('disposal removes contributions and stale disposables preserve replacement registrations', async () => {
  const first = registerExplorerContextMenuProvider({ id: 'runner', provideMenuEntries: () => [entry] })
  first.dispose()
  deepStrictEqual(await getExplorerContextMenuEntries({ isDirectory: false, uri: 'a.js' }), [])
  registerExplorerContextMenuProvider({ id: 'runner', provideMenuEntries: () => [entry] })
  first.dispose()
  deepStrictEqual(await getExplorerContextMenuEntries({ isDirectory: false, uri: 'a.js' }), [entry])
})

test('disposal during a pending provider request drops its result', async () => {
  const { promise: result, resolve } = Promise.withResolvers<readonly (typeof entry)[]>()
  const disposable = registerExplorerContextMenuProvider({ id: 'runner', provideMenuEntries: () => result })
  const pending = getExplorerContextMenuEntries({ isDirectory: false, uri: 'a.js' })
  disposable.dispose()
  resolve([entry])
  deepStrictEqual(await pending, [])
})

test('rejects duplicate providers and malformed entries', async () => {
  const provider = { id: 'runner', provideMenuEntries: () => [entry] }
  registerExplorerContextMenuProvider(provider)
  throws(() => registerExplorerContextMenuProvider(provider), /already registered/)
  resetExplorerContextMenuProviders()
  registerExplorerContextMenuProvider({ id: 'bad', provideMenuEntries: () => [{ ...entry, command: '' }] })
  await rejects(getExplorerContextMenuEntries({ isDirectory: false, uri: 'a.js' }), /require an id, label and command/)
})
