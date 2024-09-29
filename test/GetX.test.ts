import { expect, test, jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.ts', () => {
  return {
    measureTextWidth() {
      return 52
    },
  }
})

const GetX = await import('../src/parts/GetX/GetX.ts')

test('getX - empty line', () => {
  const line = ''
  const column = 0
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = true
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 10
  const averageCharWidth = 9
  const difference = 0
  expect(
    GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference
    )
  ).toBe(0)
})

test('getX - first column', () => {
  const line = 'test'
  const column = 0
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = true
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 10
  const averageCharWidth = 9
  const difference = 0
  expect(
    GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference
    )
  ).toBe(0)
})

test('getX - enough space', () => {
  const line = 'test'
  const column = 4
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = true
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 25
  const averageCharWidth = 9
  const difference = 0
  expect(
    GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference
    )
  ).toBe(25)
})

test('getX - measure text width', () => {
  const line = 'test'
  const column = 1
  const fontWeight = 400
  const fontSize = 16
  const fontFamily = 'test font'
  const isMonospaceFont = true
  const letterSpacing = 0.5
  const tabSize = 2
  const halfCursorWidth = 1
  const width = 1000
  const averageCharWidth = 9
  const difference = 0
  expect(
    GetX.getX(
      line,
      column,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      difference
    )
  ).toBe(51)
})
