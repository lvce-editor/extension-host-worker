import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

export interface IsolatedLanguageProviderResult {
  readonly found: boolean
  readonly result?: unknown
}

export const hasLegacyProvider = (getProvider: (languageId: string) => unknown, textDocumentId: number): boolean => {
  const textDocument = TextDocument.get(textDocumentId)
  return Boolean(textDocument && getProvider(textDocument.languageId))
}

export const executeLegacy = (executeProvider: any, textDocumentId: number, args: readonly unknown[]): unknown => {
  return executeProvider(textDocumentId, ...args)
}

const isUnavailableError = (error: unknown): boolean => {
  return (
    (error instanceof Error && error.name === 'CommandNotFoundError') ||
    (error instanceof TypeError && error.message === "Cannot read properties of undefined (reading 'invoke')")
  )
}

const invoke = async (method: string, ...args: readonly unknown[]): Promise<IsolatedLanguageProviderResult> => {
  try {
    return await ExtensionManagementWorker.invoke(method, ...args)
  } catch (error) {
    if (isUnavailableError(error)) {
      return { found: false }
    }
    throw error
  }
}

export const execute = async (
  kind: string,
  methodName: string,
  textDocumentId: number,
  ...args: readonly unknown[]
): Promise<IsolatedLanguageProviderResult> => {
  const textDocument = TextDocument.get(textDocumentId)
  if (!textDocument) {
    return { found: false }
  }
  return invoke('Extensions.executeLanguageProvider', kind, methodName, textDocument, ...args)
}

export const executeWithTextDocument = (
  kind: string,
  methodName: string,
  textDocument: { readonly languageId: string; readonly [key: string]: unknown },
  ...args: readonly unknown[]
): Promise<IsolatedLanguageProviderResult> => {
  return invoke('Extensions.executeLanguageProvider', kind, methodName, textDocument, ...args)
}

export const executeOrganizeImports = async (textDocumentId: number): Promise<IsolatedLanguageProviderResult> => {
  const textDocument = TextDocument.get(textDocumentId)
  if (!textDocument) {
    return { found: false }
  }
  return invoke('Extensions.executeOrganizeImportsProvider', textDocument)
}
