import type { CompletionItem } from '../CompletionItem/CompletionItem.ts'
import type { TextDocument } from '../CompletionTextDocument/CompletionTextDocument.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { getCompletionProviderByLanguageId } from '../CompletionProviderState/CompletionProviderState.ts'

const getType = (value: unknown): string => {
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
  return typeof value
}

function validateCompletionResult(completion: unknown): readonly CompletionItem[] {
  if (!Array.isArray(completion)) {
    throw new ExtensionApiError(`invalid completion result: completion must be of type array but is ${getType(completion)}`)
  }
  for (const item of completion) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new ExtensionApiError(`invalid completion result: expected completion item to be of type object but was of type ${getType(item)}`)
    }
  }
  return completion
}

export const executeCompletionProvider = async (
  textDocument: TextDocument,
  offset: number,
  ...args: readonly unknown[]
): Promise<readonly CompletionItem[]> => {
  const provider = getCompletionProviderByLanguageId(textDocument.languageId)
  if (!provider) {
    throw new ExtensionApiError(`No completion provider found for ${textDocument.languageId}`)
  }
  const completion = await provider.provideCompletions(textDocument, offset, ...args)
  return validateCompletionResult(completion)
}

export const executeResolveCompletionItemProvider = async (
  textDocument: TextDocument,
  offset: number,
  name: string,
  completionItem: CompletionItem,
  ...args: readonly unknown[]
): Promise<CompletionItem | undefined> => {
  const provider = getCompletionProviderByLanguageId(textDocument.languageId)
  if (!provider) {
    throw new ExtensionApiError(`No completion provider found for ${textDocument.languageId}`)
  }
  return provider.resolveCompletionItem?.(textDocument, offset, name, completionItem, ...args)
}
