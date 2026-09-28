import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'sample.isolated-extension-authentication-provider'

export const test: Test = async ({ Command, Extension }) => {
  const uri = import.meta.resolve(`../fixtures/${name}`)
  await Extension.addWebExtension(uri)

  const sessions = await Command.execute('ExtensionHost.executeCommand', 'isolatedAbout.getSessions', ['profile'])
  const firstSession = Array.isArray(sessions) ? sessions[0] : undefined
  if (
    !firstSession ||
    firstSession.id !== 'sample-session' ||
    firstSession.accessToken !== 'sample-access-token' ||
    firstSession.account?.id !== 'sample-account' ||
    firstSession.account?.label !== 'Sample Account' ||
    JSON.stringify(firstSession.scopes) !== JSON.stringify(['profile', 'email'])
  ) {
    throw new Error(`Expected authentication sessions, got ${JSON.stringify(sessions)}`)
  }

  const snapshot = await Command.execute('ExtensionHost.executeCommand', 'isolatedAbout.getAuthenticationProviderRegistrySnapshot')
  if (
    JSON.stringify(snapshot) !==
    JSON.stringify({
      providers: [
        { id: 'sample-authentication', label: 'Sample Authentication' },
        { id: 'other-authentication', label: 'Other Authentication' },
      ],
    })
  ) {
    throw new Error(`Expected provider identities without session data, got ${JSON.stringify(snapshot)}`)
  }

  const createdSession = await Command.execute('ExtensionHost.executeCommand', 'isolatedAbout.createSession', ['email'])
  if (
    !createdSession ||
    createdSession.id !== 'sample-session' ||
    createdSession.accessToken !== 'sample-access-token' ||
    createdSession.account?.id !== 'sample-account' ||
    createdSession.account?.label !== 'Sample Account' ||
    JSON.stringify(createdSession.scopes) !== JSON.stringify(['email'])
  ) {
    throw new Error(`Expected authentication session with requested scopes, got ${JSON.stringify(createdSession)}`)
  }

  const otherSessions = await Command.execute('ExtensionHost.executeCommand', 'isolatedAbout.getOtherProviderSessions')
  if (!Array.isArray(otherSessions) || otherSessions[0]?.id !== 'other-session') {
    throw new Error(`Expected a session from the other provider, got ${JSON.stringify(otherSessions)}`)
  }

  await Command.execute('ExtensionHost.executeCommand', 'isolatedAbout.removeSession', 'sample-session')
  try {
    await Command.execute('ExtensionHost.executeCommand', 'isolatedAbout.getSessions', ['failure'])
    throw new Error('Expected authentication provider error to propagate')
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('authentication provider failed')) {
      throw error
    }
  }
}
