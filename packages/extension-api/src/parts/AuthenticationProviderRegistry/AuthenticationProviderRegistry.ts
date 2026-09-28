import type { AuthenticationProvider, AuthenticationSession } from '../AuthenticationProvider/AuthenticationProvider.ts'
import type { AuthenticationProviderRegistrySnapshot } from '../AuthenticationProviderRegistrySnapshot/AuthenticationProviderRegistrySnapshot.ts'
import type { Disposable } from '../Disposable/Disposable.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const providers: Record<string, AuthenticationProvider> = Object.create(null)

const assertSession = (session: unknown, providerId: string): AuthenticationSession => {
  if (!session || typeof session !== 'object') {
    throw new ExtensionApiError(`authentication provider ${providerId} returned an invalid session`)
  }
  const value = session as Record<string, unknown>
  if (typeof value.id !== 'string' || value.id.length === 0) {
    throw new ExtensionApiError(`authentication provider ${providerId} returned a session without an id`)
  }
  if (typeof value.accessToken !== 'string' || value.accessToken.length === 0) {
    throw new ExtensionApiError(`authentication provider ${providerId} returned a session without an access token`)
  }
  if (!Array.isArray(value.scopes) || value.scopes.some((scope) => typeof scope !== 'string' || scope.length === 0)) {
    throw new ExtensionApiError(`authentication provider ${providerId} returned a session with invalid scopes`)
  }
  if (!value.account || typeof value.account !== 'object') {
    throw new ExtensionApiError(`authentication provider ${providerId} returned a session without an account`)
  }
  const account = value.account as Record<string, unknown>
  if (typeof account.id !== 'string' || account.id.length === 0 || typeof account.label !== 'string' || account.label.length === 0) {
    throw new ExtensionApiError(`authentication provider ${providerId} returned a session with an invalid account`)
  }
  return session as AuthenticationSession
}

const assertScopes = (scopes: readonly string[]): void => {
  if (!Array.isArray(scopes) || scopes.some((scope) => !(typeof scope === 'string' && scope.length > 0))) {
    throw new ExtensionApiError('authentication scopes must be an array of non-empty strings')
  }
}

const getProvider = (providerId: string): AuthenticationProvider => {
  const provider = providers[providerId]
  if (!provider) {
    throw new ExtensionApiError(`authentication provider ${providerId} not found`)
  }
  return provider
}

export const registerAuthenticationProvider = (provider: AuthenticationProvider): Disposable => {
  if (!provider) {
    throw new ExtensionApiError('authentication provider is not defined')
  }
  const providerRecord = provider as unknown as Record<string, unknown>
  if (typeof providerRecord.id !== 'string' || providerRecord.id.length === 0) {
    throw new ExtensionApiError('authentication provider is missing id')
  }
  const { id } = provider
  if (typeof providerRecord.label !== 'string' || providerRecord.label.length === 0) {
    throw new ExtensionApiError(`authentication provider ${id} is missing label`)
  }
  for (const methodName of ['getSessions', 'createSession', 'removeSession'] as const) {
    if (typeof providerRecord[methodName] !== 'function') {
      throw new ExtensionApiError(`authentication provider ${id} is missing ${methodName} function`)
    }
  }
  if (id in providers) {
    throw new ExtensionApiError(`authentication provider ${id} is already registered`)
  }
  providers[id] = provider
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  return {
    dispose(): void {
      delete providers[id]
    },
  }
}

export const executeAuthenticationProviderGetSessions = async (
  providerId: string,
  scopes: readonly string[],
): Promise<readonly AuthenticationSession[]> => {
  assertScopes(scopes)
  const sessions = await getProvider(providerId).getSessions(scopes)
  if (!Array.isArray(sessions)) {
    throw new ExtensionApiError(`authentication provider ${providerId} returned invalid sessions`)
  }
  return sessions.map((session) => assertSession(session, providerId))
}

export const executeAuthenticationProviderCreateSession = async (providerId: string, scopes: readonly string[]): Promise<AuthenticationSession> => {
  assertScopes(scopes)
  return assertSession(await getProvider(providerId).createSession(scopes), providerId)
}

export const executeAuthenticationProviderRemoveSession = async (providerId: string, sessionId: string): Promise<void> => {
  if (typeof sessionId !== 'string' || sessionId.length === 0) {
    throw new ExtensionApiError('authentication session id is missing')
  }
  await getProvider(providerId).removeSession(sessionId)
}

export const getAuthenticationProviderRegistrySnapshot = (): AuthenticationProviderRegistrySnapshot => ({
  providers: Object.values(providers).map(({ id, label }) => ({ id, label })),
})

export const resetAuthenticationProviderRegistry = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}

const commandMap = {
  'ExtensionApi.executeAuthenticationProviderCreateSession': executeAuthenticationProviderCreateSession,
  'ExtensionApi.executeAuthenticationProviderGetSessions': executeAuthenticationProviderGetSessions,
  'ExtensionApi.executeAuthenticationProviderRemoveSession': executeAuthenticationProviderRemoveSession,
  'ExtensionApi.getAuthenticationProviderRegistrySnapshot': getAuthenticationProviderRegistrySnapshot,
}
