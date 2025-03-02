import { expect, test } from '@jest/globals'
import * as Path from '../src/parts/Path/Path.ts'

test('dirname - with path separator', () => {
  expect(Path.dirname('/', '/test/file.txt')).toBe('/test')
})

test('dirname - without path separator', () => {
  expect(Path.dirname('/', 'file.txt')).toBe('file.txt')
})

test('extname - with extension', () => {
  expect(Path.extname('file.txt')).toBe('.txt')
})

test('extname - without extension', () => {
  expect(Path.extname('file')).toBe('')
})

test('join - multiple parts', () => {
  expect(Path.join('/', 'test', 'file.txt')).toBe('test/file.txt')
})

test('join - single part', () => {
  expect(Path.join('/', 'file.txt')).toBe('file.txt')
})

test('join - empty parts', () => {
  expect(Path.join('/')).toBe('')
})
