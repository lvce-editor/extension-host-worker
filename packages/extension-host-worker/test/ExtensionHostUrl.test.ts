import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.ts', () => {
  return {
    platform: 'electron',
  }
})

const ExtensionHostUrl = await import('../src/parts/ExtensionHostUrl/ExtensionHostUrl.ts')

test('getRemoteUrlSync - posix path', () => {
  expect(ExtensionHostUrl.getRemoteUrlSync('/tmp/sample.js')).toBe('/remote/tmp/sample.js')
})

test('getRemoteUrlSync - windows file uri', () => {
  expect(ExtensionHostUrl.getRemoteUrlSync('file:///D:/a/sample.js')).toBe('/remote/D:/a/sample.js')
})

test('getRemoteUrlSync - malformed windows file uri', () => {
  expect(ExtensionHostUrl.getRemoteUrlSync('file://D:/a/sample.js')).toBe('/remote/D:/a/sample.js')
})

test('getRemoteUrlSync - windows path', () => {
  expect(ExtensionHostUrl.getRemoteUrlSync('D:\\a\\sample.js')).toBe('/remote/D:/a/sample.js')
})
