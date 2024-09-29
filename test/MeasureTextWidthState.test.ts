import { expect, test } from '@jest/globals'
import * as MeasureTextWidthState from '../src/parts/MeasureTextWidthState/MeasureTextWidthState.ts'

const ctx = {} as OffscreenCanvasRenderingContext2D

const createCtx = () => {
  return ctx
}

test('getOrCreate', () => {
  expect(MeasureTextWidthState.getOrCreate(createCtx)).toBe(ctx)
  expect(MeasureTextWidthState.getOrCreate(createCtx)).toBe(ctx) // cached
})
