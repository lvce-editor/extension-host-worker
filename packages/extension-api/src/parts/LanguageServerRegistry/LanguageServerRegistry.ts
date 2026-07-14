import type { Disposable } from '../Disposable/Disposable.ts'
import type { LanguageServerOptions } from '../LanguageServerOptions/LanguageServerOptions.ts'
import type { LanguageServerRegistrySnapshot } from '../LanguageServerRegistrySnapshot/LanguageServerRegistrySnapshot.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'

const languageServers: Record<string, LanguageServerOptions> = Object.create(null)

const assertNonEmptyString: (value: unknown, name: string) => asserts value is string = (value, name) => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new ExtensionApiError(`language server is missing ${name}`)
  }
}

const validateLanguageServer = (options: LanguageServerOptions): void => {
  if (!options) {
    throw new ExtensionApiError('language server is not defined')
  }
  assertNonEmptyString(options.id, 'id')
  assertNonEmptyString(options.languageId, 'languageId')
  assertNonEmptyString(options.uri, 'uri')
  if (!Array.isArray(options.argv) || options.argv.some((argument) => typeof argument !== 'string')) {
    throw new ExtensionApiError(`language server ${options.id} has invalid argv`)
  }
  if (options.id in languageServers) {
    throw new ExtensionApiError(`language server ${options.id} is already registered`)
  }
}

export const registerLanguageServer = (options: LanguageServerOptions): Disposable => {
  validateLanguageServer(options)
  languageServers[options.id] = {
    argv: [...options.argv],
    id: options.id,
    languageId: options.languageId,
    uri: options.uri,
  }
  return {
    dispose(): void {
      delete languageServers[options.id]
    },
  }
}

export const getLanguageServerRegistrySnapshot = (): LanguageServerRegistrySnapshot => {
  return {
    languageServers: Object.values(languageServers),
  }
}

export const resetLanguageServerRegistry = (): void => {
  for (const id of Object.keys(languageServers)) {
    delete languageServers[id]
  }
}
