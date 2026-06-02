import type { HoverResult } from '../HoverResult/HoverResult.ts'
import type { TextDocument } from '../HoverTextDocument/HoverTextDocument.ts'

export interface RegisteredHoverProvider {
  readonly id: string
  readonly languageId: string
  readonly provideHover: (textDocument: TextDocument, offset: number, ...args: readonly unknown[]) => HoverResult | undefined | Promise<HoverResult | undefined>
}
