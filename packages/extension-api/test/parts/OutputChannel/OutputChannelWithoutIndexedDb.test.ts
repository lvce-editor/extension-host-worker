import { doesNotThrow } from 'node:assert/strict'
import { test } from 'node:test'
import { createOutputChannel, resetOutputChannelRegistry } from '../../../src/parts/OutputChannel/OutputChannel.ts'

test('createOutputChannel does not access IndexedDB before activation', () => {
  const indexedDbDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB')
  Object.defineProperty(globalThis, 'indexedDB', {
    configurable: true,
    get() {
      throw new Error('IndexedDB accessed')
    },
  })

  try {
    doesNotThrow(() => createOutputChannel('sample-output'))
  } finally {
    resetOutputChannelRegistry()
    if (indexedDbDescriptor) {
      Object.defineProperty(globalThis, 'indexedDB', indexedDbDescriptor)
    } else {
      Reflect.deleteProperty(globalThis, 'indexedDB')
    }
  }
})
