import { strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { VirtualDomElements } from '../../../src/index.ts'

test('exports virtual DOM element IDs without activating the extension API', () => {
  strictEqual(VirtualDomElements.Button, 1)
  strictEqual(VirtualDomElements.Div, 4)
  strictEqual(VirtualDomElements.Text, 12)
})
