import type { Disposable } from '../Disposable/Disposable.ts'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'
import * as ExtensionApiCommandRegistry from '../ExtensionApiCommandRegistry/ExtensionApiCommandRegistry.ts'
import { ExtensionApiError } from '../ExtensionApiError/ExtensionApiError.ts'
import { createProviderRegistry } from '../ProviderRegistry/ProviderRegistry.ts'

export interface EditorTextDecorationRange {
  readonly endColumnIndex: number
  readonly endRowIndex: number
  readonly startColumnIndex: number
  readonly startRowIndex: number
}

export interface EditorTextDecoration extends EditorTextDecorationRange {
  /** A six-digit hexadecimal color, including #. */
  readonly color: string
  /** Underline thickness in pixels, from 1 to 4. Defaults to 2. */
  readonly thickness?: number
}

export interface EditorTextDecorationTextDocument {
  readonly languageId: string
  readonly selections: readonly EditorTextDecorationRange[]
  readonly text: string
  readonly uri: string
}

export interface EditorTextDecorationProvider {
  readonly id: string
  readonly provideEditorTextDecorations: (
    textDocument: EditorTextDecorationTextDocument,
  ) => readonly EditorTextDecoration[] | Promise<readonly EditorTextDecoration[]>
}

const validateDecoration = (value: unknown): EditorTextDecoration => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ExtensionApiError('invalid editor text decoration: expected an object')
  }
  const { color, endColumnIndex, endRowIndex, startColumnIndex, startRowIndex, thickness = 2 } = value as EditorTextDecoration
  if (
    [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex].some((item) => !(Number.isSafeInteger(item) && item >= 0)) ||
    endRowIndex < startRowIndex ||
    (endRowIndex === startRowIndex && endColumnIndex < startColumnIndex)
  ) {
    throw new ExtensionApiError('invalid editor text decoration: expected an ordered non-negative range')
  }
  if (typeof color !== 'string' || !/^#[\da-f]{6}$/i.test(color) || !Number.isSafeInteger(thickness) || thickness < 1 || thickness > 4) {
    throw new ExtensionApiError('invalid editor text decoration: expected a hex color and thickness from 1 to 4')
  }
  return { color, endColumnIndex, endRowIndex, startColumnIndex, startRowIndex, thickness }
}

const registry = createProviderRegistry<EditorTextDecorationProvider, EditorTextDecorationProvider>({
  mapProvider: (provider) => ({ id: provider.id, provideEditorTextDecorations: (document) => provider.provideEditorTextDecorations(document) }),
  providerName: 'editor text decoration provider',
  requiredMethods: ['provideEditorTextDecorations'],
})

export const executeEditorTextDecorationProvider = async (document: EditorTextDecorationTextDocument): Promise<readonly EditorTextDecoration[]> => {
  const providers = registry.getProviders()
  const results = await Promise.all(
    providers.map(async (provider) => {
      const result = await provider.provideEditorTextDecorations(document)
      if (!Array.isArray(result)) {
        throw new ExtensionApiError('invalid editor text decorations: expected an array')
      }
      // Ignore results from a provider disposed while its request was in flight.
      if (!registry.getProviders().includes(provider)) {
        return []
      }
      return result.map(validateDecoration)
    }),
  )
  return results.flat()
}

export const registerEditorTextDecorationProvider = (provider: EditorTextDecorationProvider): Disposable => {
  const registered = registry.registerProvider(provider)
  ExtensionApiCommandRegistry.registerCommandMap({ 'ExtensionApi.executeEditorTextDecorationProvider': executeEditorTextDecorationProvider })
  let disposed = false
  return {
    dispose(): void {
      if (!disposed) {
        disposed = true
        registry.deleteProvider(registered.id)
      }
    },
  }
}

export const refreshEditorTextDecorations = async (): Promise<void> => {
  await executeCommand('Editor.refreshTextDecorations')
}

export const resetEditorTextDecorationProviderRegistry = registry.reset
