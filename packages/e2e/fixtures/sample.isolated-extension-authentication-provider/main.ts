import {
  activate as activateExtensionApi,
  executeAuthenticationProviderCreateSession,
  executeAuthenticationProviderGetSessions,
  executeAuthenticationProviderRemoveSession,
  getAuthenticationProviderRegistrySnapshot,
  registerAuthenticationProvider,
  registerCommand,
} from '@lvce-editor/api'

const session = {
  id: 'sample-session',
  accessToken: 'sample-access-token',
  account: { id: 'sample-account', label: 'Sample Account' },
  scopes: ['profile', 'email'],
}

const activate = async (): Promise<void> => {
  await activateExtensionApi()
  registerAuthenticationProvider({
    id: 'sample-authentication',
    label: 'Sample Authentication',
    getSessions(scopes) {
      if (scopes.includes('failure')) {
        throw new Error('authentication provider failed')
      }
      return scopes.length ? [session] : []
    },
    createSession(scopes) {
      return { ...session, scopes }
    },
    removeSession(sessionId) {
      if (sessionId !== session.id) {
        throw new Error(`Unknown session ${sessionId}`)
      }
    },
  })
  registerAuthenticationProvider({
    id: 'other-authentication',
    label: 'Other Authentication',
    getSessions() {
      return [{ ...session, id: 'other-session', accessToken: 'other-token' }]
    },
    createSession(scopes) {
      return { ...session, id: 'other-session', accessToken: 'other-token', scopes }
    },
    removeSession() {},
  })
  registerCommand({
    execute() {
      return getAuthenticationProviderRegistrySnapshot()
    },
    id: 'isolatedAbout.getAuthenticationProviderRegistrySnapshot',
  })
  registerCommand({
    execute(scopes: readonly string[]) {
      return executeAuthenticationProviderGetSessions('sample-authentication', scopes)
    },
    id: 'isolatedAbout.getSessions',
  })
  registerCommand({
    execute(scopes: readonly string[]) {
      return executeAuthenticationProviderCreateSession('sample-authentication', scopes)
    },
    id: 'isolatedAbout.createSession',
  })
  registerCommand({
    execute(sessionId: string) {
      return executeAuthenticationProviderRemoveSession('sample-authentication', sessionId)
    },
    id: 'isolatedAbout.removeSession',
  })
  registerCommand({
    execute() {
      return executeAuthenticationProviderGetSessions('other-authentication', ['profile'])
    },
    id: 'isolatedAbout.getOtherProviderSessions',
  })
}

await activate()
