import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

const allowedHrefProtocols = new Set(['http', 'https', 'mailto', 'tel'])
const allowedSrcProtocols = new Set(['http', 'https'])
const protocolPattern = /^([a-z][a-z\d+.-]*):/i

const isAllowedUrl = (value: string, allowedProtocols: ReadonlySet<string>): boolean => {
  const normalizedValue = [...value]
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0
      return codePoint > 32 && codePoint !== 127
    })
    .join('')
  const protocol = protocolPattern.exec(normalizedValue)?.[1]?.toLowerCase()
  return !protocol || allowedProtocols.has(protocol)
}

export const sanitizeMarkdownVirtualDom = (nodes: readonly VirtualDomNode[]): readonly VirtualDomNode[] => {
  return nodes.map((node) => {
    const sanitizedNode = { ...node }
    if (typeof sanitizedNode.href === 'string' && !isAllowedUrl(sanitizedNode.href, allowedHrefProtocols)) {
      delete sanitizedNode.href
    }
    if (sanitizedNode.type === VirtualDomElements.A && typeof sanitizedNode.href === 'string') {
      sanitizedNode.target = '_blank'
      sanitizedNode.rel = 'noopener noreferrer'
    }
    if (typeof sanitizedNode.src === 'string' && !isAllowedUrl(sanitizedNode.src, allowedSrcProtocols)) {
      delete sanitizedNode.src
    }
    return sanitizedNode
  })
}
