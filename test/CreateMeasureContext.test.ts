import { expect, test } from '@jest/globals'
import * as CreateMeasureContext from '../src/parts/CreateMeasureContext/CreateMeasureContext.ts'

test('createMeasureContext - error', () => {
  // @ts-ignore
  globalThis.OffscreenCanvas = class {
    getContext() {
      return undefined
    }
  }
  expect(() => CreateMeasureContext.createMeasureContext()).toThrow(new Error(`Failed to get canvas context 2d`))
})

test('createMeasureContext', () => {
  const ctx = {}
  // @ts-ignore
  globalThis.OffscreenCanvas = class {
    getContext() {
      return ctx
    }
  }
  expect(CreateMeasureContext.createMeasureContext()).toBe(ctx)
})
