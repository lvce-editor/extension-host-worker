import { expect, test } from '@jest/globals'
import * as GetUrlPrefix from '../src/parts/GetUrlPrefix/GetUrlPrefix.ts'

test('http url', () => {
  const extensionPath = 'http://localhost:3000'
  expect(GetUrlPrefix.getUrlPrefix(extensionPath)).toBe('http://localhost:3000')
})

test('https', () => {
  const extensionPath = 'https://example.com'
  expect(GetUrlPrefix.getUrlPrefix(extensionPath)).toBe('https://example.com')
})

test('web', () => {
  const extensionPath = '/video-preview/dist/extension.js'
  expect(GetUrlPrefix.getUrlPrefix(extensionPath)).toBe('/video-preview/dist/extension.js')
})

test('remote', () => {
  const extensionPath = '/home/user/video-preview/dist/extension.js'
  expect(GetUrlPrefix.getUrlPrefix(extensionPath)).toBe('/remote/home/user/video-preview/dist/extension.js')
})
