import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'
import { sanitizeMarkdownVirtualDom } from './SanitizeMarkdownVirtualDom.ts'

export const markdownToVirtualDom = async (markdown: string): Promise<readonly VirtualDomNode[]> => {
  const html = (await executeCommand('Markdown.renderMarkdown', markdown)) as string
  const nodes = (await executeCommand('Markdown.getVirtualDom', html)) as readonly VirtualDomNode[]
  return sanitizeMarkdownVirtualDom(nodes)
}
