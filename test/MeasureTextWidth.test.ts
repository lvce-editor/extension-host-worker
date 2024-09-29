import { expect, test, beforeAll } from '@jest/globals'
import * as MeasureTextWidth from '../src/parts/MeasureTextWidth/MeasureTextWidth.ts'

beforeAll(() => {
  // @ts-ignore
  globalThis.OffscreenCanvas = class {
    getContext() {
      return {
        measureText() {
          return {
            width: 8.5,
          }
        },
      }
    }
  }
})

test('monospace', () => {
  const text = 'a'
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const letterSpacing = 0.5
  const isMonoSpaceFont = true
  const charWidth = 9
  expect(MeasureTextWidth.measureTextWidth(text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)).toBe(9)
})

test('other', () => {
  const text = 'a'
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const letterSpacing = 0.5
  const isMonoSpaceFont = false
  const charWidth = 9
  expect(MeasureTextWidth.measureTextWidth(text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)).toBe(8.5)
})

test('error - letterSpacing is not of type number', () => {
  const text = 'a'
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const letterSpacing = '0.5' as any
  const isMonoSpaceFont = false
  const charWidth = 9
  expect(() => MeasureTextWidth.measureTextWidth(text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)).toThrow(
    new Error('letterSpacing must be of type number')
  )
})
