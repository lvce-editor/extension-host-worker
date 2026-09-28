import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sanitizeMarkdownVirtualDom } from '../../../src/parts/Markdown/SanitizeMarkdownVirtualDom.ts'

test('keeps relative and web links and image sources', () => {
  const nodes = sanitizeMarkdownVirtualDom([
    { childCount: 0, href: '../pull/1', rel: 'noopener noreferrer', target: '_blank', type: VirtualDomElements.A },
    { childCount: 0, href: 'https://example.com', rel: 'noopener noreferrer', target: '_blank', type: VirtualDomElements.A },
    { childCount: 0, src: '/image.png', type: VirtualDomElements.Img },
  ])
  assert.equal(nodes[0].href, '../pull/1')
  assert.equal(nodes[1].href, 'https://example.com')
  assert.equal(nodes[2].src, '/image.png')
})

test('removes unsafe URL schemes and schemes hidden by whitespace', () => {
  const nodes = sanitizeMarkdownVirtualDom([
    { childCount: 0, href: 'javascript:alert(1)', rel: 'noopener noreferrer', target: '_blank', type: VirtualDomElements.A },
    { childCount: 0, href: 'java\nscript:alert(1)', rel: 'noopener noreferrer', target: '_blank', type: VirtualDomElements.A },
    { childCount: 0, src: 'data:image/svg+xml,<svg/>', type: VirtualDomElements.Img },
  ])
  assert.equal(nodes[0].href, undefined)
  assert.equal(nodes[1].href, undefined)
  assert.equal(nodes[2].src, undefined)
})
