import { expect, test } from '@jest/globals'
import * as EditorCompletionMap from '../src/parts/EditorCompletionMap/EditorCompletionMap.ts'
import * as EditorCompletionType from '../src/parts/EditorCompletionType/EditorCompletionType.ts'
import * as SymbolName from '../src/parts/SymbolName/SymbolName.ts'

test('property', () => {
  expect(EditorCompletionMap.getSymbolName(EditorCompletionType.Property)).toBe(SymbolName.SymbolProperty)
})

test('value', () => {
  expect(EditorCompletionMap.getSymbolName(EditorCompletionType.Value)).toBe(SymbolName.SymbolValue)
})

test('function', () => {
  expect(EditorCompletionMap.getSymbolName(EditorCompletionType.Function)).toBe(SymbolName.SymbolFunction)
})

test('variable', () => {
  expect(EditorCompletionMap.getSymbolName(EditorCompletionType.Variable)).toBe(SymbolName.SymbolVariable)
})

test('keyword', () => {
  expect(EditorCompletionMap.getSymbolName(EditorCompletionType.Keyword)).toBe(SymbolName.SymbolKeyword)
})

test('field', () => {
  expect(EditorCompletionMap.getSymbolName(EditorCompletionType.Field)).toBe(SymbolName.SymbolField)
})

test('file', () => {
  expect(EditorCompletionMap.getSymbolName(EditorCompletionType.File)).toBe(SymbolName.SymbolNone)
})

test('other', () => {
  expect(EditorCompletionMap.getSymbolName(123)).toBe(SymbolName.SymbolDefault)
})
