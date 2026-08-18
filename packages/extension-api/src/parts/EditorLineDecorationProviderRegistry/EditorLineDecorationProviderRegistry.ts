import type { Disposable } from '../Disposable/Disposable.ts'
import type { EditorLineDecoration } from '../EditorLineDecoration/EditorLineDecoration.ts'
import type { EditorLineDecorationProvider } from '../EditorLineDecorationProvider/EditorLineDecorationProvider.ts'
import type { EditorLineDecorationTextDocument } from '../EditorLineDecorationTextDocument/EditorLineDecorationTextDocument.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'
import type { RegisteredEditorLineDecorationProvider } from '../RegisteredEditorLineDecorationProvider/RegisteredEditorLineDecorationProvider.ts'

const validateEditorLineDecoration = (decoration: unknown): EditorLineDecoration | undefined => {
  if (decoration === undefined) {
    return undefined
  }
  if (!decoration || typeof decoration !== 'object' || Array.isArray(decoration)) {
    throw new ExtensionApiError('invalid editor line decoration result: decoration must be an object or undefined')
  }
  const { text } = decoration as { readonly text?: unknown }
  if (typeof text !== 'string') {
    throw new ExtensionApiError('invalid editor line decoration result: decoration text must be a string')
  }
  return { text }
}

const registry = createProviderRegistry<EditorLineDecorationProvider, RegisteredEditorLineDecorationProvider>({
  mapProvider(provider) {
    return {
      id: provider.id,
      provideEditorLineDecoration(textDocument, rowIndex) {
        return provider.provideEditorLineDecoration(textDocument, rowIndex)
      },
    }
  },
  providerName: 'editor line decoration provider',
  requiredMethods: ['provideEditorLineDecoration'],
})

export const registerEditorLineDecorationProvider = (provider: EditorLineDecorationProvider): Disposable => {
  const registeredProvider = registry.registerProvider(provider)
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
    },
  }
}

export const executeEditorLineDecorationProvider = async (
  textDocument: EditorLineDecorationTextDocument,
  rowIndex: number,
): Promise<readonly EditorLineDecoration[]> => {
  const results = await Promise.all(
    registry.getProviders().map(async (provider) => validateEditorLineDecoration(await provider.provideEditorLineDecoration(textDocument, rowIndex))),
  )
  return results.filter((result): result is EditorLineDecoration => result !== undefined)
}

const commandMap = {
  'ExtensionApi.executeEditorLineDecorationProvider': executeEditorLineDecorationProvider,
}

export const resetEditorLineDecorationProviderRegistry = registry.reset
