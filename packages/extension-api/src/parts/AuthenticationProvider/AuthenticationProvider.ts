export interface AuthenticationAccount {
  readonly id: string
  readonly label: string
}

export interface AuthenticationSession {
  readonly accessToken: string
  readonly account: AuthenticationAccount
  readonly id: string
  readonly scopes: readonly string[]
}

export interface AuthenticationProvider {
  readonly createSession: (scopes: readonly string[]) => Promise<AuthenticationSession> | AuthenticationSession
  readonly getSessions: (scopes: readonly string[]) => Promise<readonly AuthenticationSession[]> | readonly AuthenticationSession[]
  readonly id: string
  readonly label: string
  readonly removeSession: (sessionId: string) => Promise<void> | void
}
