import { expect, test } from '@jest/globals'
import { getType } from '../src/parts/GetType/GetType.ts'

test('getType - number', () => {
  expect(getType(42)).toBe('number')
})

test('getType - function', () => {
  expect(getType(() => {})).toBe('function')
})

test('getType - string', () => {
  expect(getType('hello')).toBe('string')
})

test('getType - null', () => {
  expect(getType(null)).toBe('null')
})

test('getType - array', () => {
  expect(getType([])).toBe('array')
})

test('getType - object', () => {
  expect(getType({})).toBe('object')
})

test('getType - boolean', () => {
  expect(getType(true)).toBe('boolean')
  expect(getType(false)).toBe('boolean')
})

test('getType - undefined', () => {
  expect(getType(undefined)).toBe('undefined')
})

test('getType - symbol', () => {
  expect(getType(Symbol())).toBe('unknown')
})
