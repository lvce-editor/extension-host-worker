import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { sanitizeMarkdownVirtualDom } from './SanitizeMarkdownVirtualDom.ts'

export const markdownToVirtualDom = async (markdown: string): Promise<readonly VirtualDomNode[]> => {
  const html = await RendererWorker.invoke('Markdown.renderMarkdown', markdown)
  const nodes = (await RendererWorker.invoke('Markdown.getVirtualDom', html)) as readonly VirtualDomNode[]
  return sanitizeMarkdownVirtualDom(nodes)
}
