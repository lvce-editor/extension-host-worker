import { expect, test } from '@jest/globals'
import * as GetUrlPrefix from '../src/parts/GetUrlPrefix/GetUrlPrefix.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'

test('http url', () => {
  const platform = PlatformType.Web
  const extensionPath = 'http://localhost:3000'
  expect(GetUrlPrefix.getUrlPrefix(platform, extensionPath)).toBe('http://localhost:3000')
})

test('https', () => {
  const platform = PlatformType.Web
  const extensionPath = 'https://example.com'
  expect(GetUrlPrefix.getUrlPrefix(platform, extensionPath)).toBe('https://example.com')
})

test('web', () => {
  const platform = PlatformType.Web
  const extensionPath = '/video-preview/dist/extension.js'
  expect(GetUrlPrefix.getUrlPrefix(platform, extensionPath)).toBe('/video-preview/dist/extension.js')
})

test.skip('remote', () => {
  const platform = PlatformType.Web
  const extensionPath = '/home/user/video-preview/dist/extension.js'
  expect(GetUrlPrefix.getUrlPrefix(platform, extensionPath)).toBe('/remote/home/user/video-preview/dist/extension.js')
})
