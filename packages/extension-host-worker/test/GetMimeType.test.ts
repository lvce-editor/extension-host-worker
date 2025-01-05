import { test, expect } from '@jest/globals'
import { getMimeType } from '../src/parts/GetMimeType/GetMimeType.ts'

test('getMimeType - html', () => {
  expect(getMimeType('.html')).toBe('text/html')
})

test('getMimeType - css', () => {
  expect(getMimeType('.css')).toBe('text/css')
})

test('getMimeType - javascript files', () => {
  expect(getMimeType('.js')).toBe('text/javascript')
  expect(getMimeType('.mjs')).toBe('text/javascript')
  expect(getMimeType('.ts')).toBe('text/javascript')
})

test('getMimeType - fonts', () => {
  expect(getMimeType('.ttf')).toBe('font/ttf')
})

test('getMimeType - images', () => {
  expect(getMimeType('.svg')).toBe('image/svg+xml')
  expect(getMimeType('.png')).toBe('image/png')
})

test('getMimeType - json and sourcemaps', () => {
  expect(getMimeType('.json')).toBe('application/json')
  expect(getMimeType('.map')).toBe('application/json')
})

test('getMimeType - media', () => {
  expect(getMimeType('.mp3')).toBe('audio/mpeg')
  expect(getMimeType('.webm')).toBe('video/webm')
})

test('getMimeType - text', () => {
  expect(getMimeType('.txt')).toBe('text/plain')
})

test('getMimeType - unknown extension', () => {
  expect(getMimeType('.unknown')).toBe('')
})
