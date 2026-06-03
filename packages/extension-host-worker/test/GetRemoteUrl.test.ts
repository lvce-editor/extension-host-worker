import { expect, test } from '@jest/globals'
import * as GetRemoteUrl from '../src/parts/GetRemoteUrl/GetRemoteUrl.ts'

test('getRemoteUrl - posix path', () => {
  expect(GetRemoteUrl.getRemoteUrl('/tmp/sample.js')).toBe('/remote/tmp/sample.js')
})

test('getRemoteUrl - windows file uri', () => {
  expect(GetRemoteUrl.getRemoteUrl('file:///D:/a/sample.js')).toBe('/remote/D:/a/sample.js')
})

test('getRemoteUrl - malformed windows file uri', () => {
  expect(GetRemoteUrl.getRemoteUrl('file://D:/a/sample.js')).toBe('/remote/D:/a/sample.js')
})

test('getRemoteUrl - windows path', () => {
  expect(GetRemoteUrl.getRemoteUrl('D:\\a\\sample.js')).toBe('/remote/D:/a/sample.js')
})
