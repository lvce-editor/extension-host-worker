import { deepStrictEqual, strictEqual, throws } from 'node:assert'
import { test } from 'node:test'
import {
  executeAuthenticationProviderCreateSession,
  executeAuthenticationProviderGetSessions,
  executeAuthenticationProviderRemoveSession,
  registerAuthenticationProvider,
  resetAuthenticationProviderRegistry,
} from '../../../src/parts/AuthenticationProviderRegistry/AuthenticationProviderRegistry.ts'

const session = {
  accessToken: 'secret-token',
  account: { id: 'account-1', label: 'Sample Account' },
  id: 'session-1',
  scopes: ['profile', 'email'],
}

test('authentication provider routes session operations with provider identity and scopes', async () => {
  resetAuthenticationProviderRegistry()
  const calls: unknown[][] = []
  registerAuthenticationProvider({
    createSession(scopes) {
      calls.push(['createSession', scopes])
      return { ...session, scopes }
    },
    getSessions(scopes) {
      calls.push(['getSessions', scopes])
      return [session]
    },
    id: 'sample',
    label: 'Sample',
    removeSession(sessionId) {
      calls.push(['removeSession', sessionId])
    },
  })

  deepStrictEqual(await executeAuthenticationProviderGetSessions('sample', ['profile']), [session])
  deepStrictEqual(await executeAuthenticationProviderCreateSession('sample', ['email']), { ...session, scopes: ['email'] })
  await executeAuthenticationProviderRemoveSession('sample', 'session-1')
  deepStrictEqual(calls, [
    ['getSessions', ['profile']],
    ['createSession', ['email']],
    ['removeSession', 'session-1'],
  ])
})

test('authentication provider rejects duplicates, missing providers, invalid callbacks and results', async () => {
  resetAuthenticationProviderRegistry()
  const provider = {
    createSession: () => session,
    getSessions: () => [session],
    id: 'sample',
    label: 'Sample',
    removeSession: () => {},
  }
  registerAuthenticationProvider(provider)
  throws(() => registerAuthenticationProvider(provider), /authentication provider sample is already registered/)
  throws(
    () => registerAuthenticationProvider({ ...provider, createSession: undefined, id: 'invalid' } as unknown as typeof provider),
    /missing createSession function/,
  )
  await rejects(() => executeAuthenticationProviderGetSessions('missing', []), /authentication provider missing not found/)
  await rejects(() => executeAuthenticationProviderCreateSession('sample', ['']), /non-empty strings/)
  registerAuthenticationProvider({
    createSession: () => ({ ...session, id: '' }),
    getSessions: () => [{ ...session, id: '' }],
    id: 'invalid-result',
    label: 'Invalid Result',
    removeSession: () => {},
  })
  await rejects(() => executeAuthenticationProviderGetSessions('invalid-result', []), /returned a session without an id/)
  await rejects(() => executeAuthenticationProviderCreateSession('invalid-result', []), /returned a session without an id/)
  registerAuthenticationProvider({
    createSession: () => ({ ...session, accessToken: '' }),
    getSessions: () => [{ ...session, accessToken: '' }],
    id: 'invalid-token',
    label: 'Invalid Token',
    removeSession: () => {},
  })
  await rejects(() => executeAuthenticationProviderGetSessions('invalid-token', []), /without an access token/)
})

test('authentication provider disposal unregisters only that provider and callback errors propagate', async () => {
  resetAuthenticationProviderRegistry()
  const disposable = registerAuthenticationProvider({
    createSession: () => session,
    getSessions: async () => {
      throw new Error('provider failed')
    },
    id: 'first',
    label: 'First',
    removeSession: () => {},
  })
  registerAuthenticationProvider({
    createSession: () => session,
    getSessions: () => [session],
    id: 'second',
    label: 'Second',
    removeSession: () => {},
  })
  await rejects(() => executeAuthenticationProviderGetSessions('first', []), /provider failed/)
  const firstSecondProviderSessions = await executeAuthenticationProviderGetSessions('second', [])
  strictEqual(firstSecondProviderSessions.length, 1)
  disposable.dispose()
  await rejects(() => executeAuthenticationProviderGetSessions('first', []), /authentication provider first not found/)
  const secondProviderSessionsAfterDispose = await executeAuthenticationProviderGetSessions('second', [])
  strictEqual(secondProviderSessionsAfterDispose.length, 1)
})

const rejects = async (callback: () => Promise<unknown>, message: RegExp): Promise<void> => {
  try {
    await callback()
  } catch (error) {
    if (!message.test(String(error))) {
      throw error
    }
    return
  }
  throw new Error(`Expected rejection matching ${message}`)
}
