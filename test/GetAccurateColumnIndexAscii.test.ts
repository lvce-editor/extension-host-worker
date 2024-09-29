import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.ts', () => {
  return {
    measureTextWidth() {
      return 18
    },
  }
})

const GetAccurateColumnIndexAscii = await import('../src/parts/GetAccurateColumnIndexAscii/GetAccurateColumnIndexAscii.ts')

test('getAccurateColumnIndexAscii - at end of line', () => {
  const line = 'abc'
  const guess = 3
  const averageCharWidth = 9
  const eventX = 10
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  expect(
    GetAccurateColumnIndexAscii.getAccurateColumnIndexAscii(
      line,
      guess,
      averageCharWidth,
      eventX,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth
    )
  ).toBe(3)
})

test('getAccurateColumnIndexAscii - in the middle of line', () => {
  const line = 'abcd'
  const guess = 1
  const averageCharWidth = 9
  const eventX = 10
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  expect(
    GetAccurateColumnIndexAscii.getAccurateColumnIndexAscii(
      line,
      guess,
      averageCharWidth,
      eventX,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth
    )
  ).toBe(1)
})
