import { test, expect } from '@jest/globals'
import { getContentType } from '../src/parts/GetContentType/GetContentType.ts'

test('getContentType - html', () => {
  expect(getContentType('/test/file.html')).toBe('text/html')
})

test('getContentType - css', () => {
  expect(getContentType('/test/file.css')).toBe('text/css')
})

test('getContentType - javascript files', () => {
  expect(getContentType('/test/file.js')).toBe('text/javascript')
  expect(getContentType('/test/file.mjs')).toBe('text/javascript')
  expect(getContentType('/test/file.ts')).toBe('text/javascript')
})

test('getContentType - fonts', () => {
  expect(getContentType('/test/file.ttf')).toBe('font/ttf')
})

test('getContentType - images', () => {
  expect(getContentType('/test/file.svg')).toBe('image/svg+xml')
  expect(getContentType('/test/file.png')).toBe('image/png')
})

test('getContentType - json and sourcemaps', () => {
  expect(getContentType('/test/file.json')).toBe('application/json')
  expect(getContentType('/test/file.map')).toBe('application/json')
})

test('getContentType - media', () => {
  expect(getContentType('/test/file.mp3')).toBe('audio/mpeg')
  expect(getContentType('/test/file.webm')).toBe('video/webm')
})

test('getContentType - text', () => {
  expect(getContentType('/test/file.txt')).toBe('text/plain')
})

test('getContentType - unknown extension', () => {
  expect(getContentType('/test/file.unknown')).toBe('')
})
