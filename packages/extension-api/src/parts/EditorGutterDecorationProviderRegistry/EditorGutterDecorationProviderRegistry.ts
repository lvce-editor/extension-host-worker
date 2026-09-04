import type { Disposable } from '../Disposable/Disposable.ts'
import type { EditorGutterDecoration, EditorGutterDecorationType } from '../EditorGutterDecoration/EditorGutterDecoration.ts'
import type { EditorGutterDecorationProvider } from '../EditorGutterDecorationProvider/EditorGutterDecorationProvider.ts'
import type { EditorGutterDecorationTextDocument } from '../EditorGutterDecorationTextDocument/EditorGutterDecorationTextDocument.ts'
import type { RegisteredEditorGutterDecorationProvider } from '../RegisteredEditorGutterDecorationProvider/RegisteredEditorGutterDecorationProvider.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

const validTypes: ReadonlySet<EditorGutterDecorationType> = new Set(['added', 'deleted', 'modified'])

const validateEditorGutterDecoration = (decoration: unknown): EditorGutterDecoration => {
  if (!decoration || typeof decoration !== 'object' || Array.isArray(decoration)) {
    throw new ExtensionApiError('invalid editor gutter decoration result: decoration must be an object')
  }
  const { rowIndex, type } = decoration as { readonly rowIndex?: unknown; readonly type?: unknown }
  if (!Number.isSafeInteger(rowIndex) || (rowIndex as number) < 0) {
    throw new ExtensionApiError('invalid editor gutter decoration result: decoration rowIndex must be a non-negative integer')
  }
  if (typeof type !== 'string' || !validTypes.has(type as EditorGutterDecorationType)) {
    throw new ExtensionApiError('invalid editor gutter decoration result: decoration type must be added, deleted, or modified')
  }
  return { rowIndex: rowIndex as number, type: type as EditorGutterDecorationType }
}

const validateEditorGutterDecorations = (decorations: unknown): readonly EditorGutterDecoration[] => {
  if (!Array.isArray(decorations)) {
    throw new ExtensionApiError('invalid editor gutter decoration result: decorations must be an array')
  }
  return decorations.map(validateEditorGutterDecoration)
}

const registry = createProviderRegistry<EditorGutterDecorationProvider, RegisteredEditorGutterDecorationProvider>({
  mapProvider(provider) {
    return {
      id: provider.id,
      provideEditorGutterDecorations(textDocument) {
        return provider.provideEditorGutterDecorations(textDocument)
      },
    }
  },
  providerName: 'editor gutter decoration provider',
  requiredMethods: ['provideEditorGutterDecorations'],
})

export const registerEditorGutterDecorationProvider = (provider: EditorGutterDecorationProvider): Disposable => {
  const registeredProvider = registry.registerProvider(provider)
  ExtensionApiCommandRegistry.registerCommandMap(commandMap)
  return {
    dispose(): void {
      registry.deleteProvider(registeredProvider.id)
    },
  }
}

export const executeEditorGutterDecorationProvider = async (
  textDocument: EditorGutterDecorationTextDocument,
): Promise<readonly EditorGutterDecoration[]> => {
  const results = await Promise.all(registry.getProviders().map(async (provider) => provider.provideEditorGutterDecorations(textDocument)))
  return results.flatMap(validateEditorGutterDecorations)
}

const commandMap = {
  'ExtensionApi.executeEditorGutterDecorationProvider': executeEditorGutterDecorationProvider,
}

export const resetEditorGutterDecorationProviderRegistry = registry.reset
