import type { RegisteredDiagnosticProvider } from '../RegisteredDiagnosticProvider/RegisteredDiagnosticProvider.ts'

export interface DiagnosticProviderRegistrySnapshot {
  readonly providers: readonly RegisteredDiagnosticProvider[]
}
