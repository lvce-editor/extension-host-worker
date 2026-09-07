import { deepStrictEqual, rejects, throws } from 'node:assert/strict'
import { test } from 'node:test'
import { providePorts, registerPortProvider } from '../../../src/parts/PortProviderRegistry/PortProviderRegistry.ts'

test('dispatches ports by URI scheme and disposes the provider', async () => {
  const port = { forwardedAddress: 'https://test-3000.app.github.dev/', port: 3000 }
  const handle = registerPortProvider({
    providePorts: (uri) => {
      deepStrictEqual(uri, 'codespaces://test/workspaces/app')
      return [port]
    },
    scheme: 'codespaces',
  })
  try {
    deepStrictEqual(await providePorts('codespaces://test/workspaces/app'), [port])
    deepStrictEqual(await providePorts('file:///app'), [])
    throws(() => registerPortProvider({ providePorts: () => [], scheme: 'codespaces' }), /already registered/)
  } finally {
    handle.dispose()
  }
  deepStrictEqual(await providePorts('codespaces://test/workspaces/app'), [])
})

test('old disposal cannot remove a replacement and pending results are discarded', async () => {
  const { promise, resolve: complete } = Promise.withResolvers<readonly { forwardedAddress: string; port: number }[]>()
  const handle = registerPortProvider({
    providePorts: () => promise,
    scheme: 'remote',
  })
  const pending = providePorts('remote://app')
  handle.dispose()
  const replacement = registerPortProvider({ providePorts: () => [{ forwardedAddress: 'https://example.com', port: 4000 }], scheme: 'remote' })
  try {
    handle.dispose()
    complete([{ forwardedAddress: 'https://example.com', port: 3000 }])
    deepStrictEqual(await pending, [])
    const ports = await providePorts('remote://app')
    deepStrictEqual(ports[0].port, 4000)
  } finally {
    replacement.dispose()
  }
})

test('rejects invalid providers and invalid results', async () => {
  throws(() => registerPortProvider({ providePorts: () => [], scheme: 'remote://' }), /requires/)
  const handle = registerPortProvider({ providePorts: () => [{ forwardedAddress: '', port: 0 }], scheme: 'remote' })
  try {
    await rejects(providePorts('remote://app'), /invalid ports/)
  } finally {
    handle.dispose()
  }
})
