import { beforeEach, expect, test } from '@jest/globals'
import * as ContentSecurityPolicyErrorState from '../src/parts/ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts'

beforeEach(() => {
  ContentSecurityPolicyErrorState.reset()
})

test('addError', () => {
  const error = {
    violatedDirective: 'script-src-elem',
    sourceFile: 'http://localhost:3000/test.ts',
    lineNumber: 1,
    columnNumber: 11,
  }
  ContentSecurityPolicyErrorState.addError(error)
  expect(ContentSecurityPolicyErrorState.hasRecentErrors()).toBe(true)
})

test('hasRecentErrors - no errors', () => {
  expect(ContentSecurityPolicyErrorState.hasRecentErrors()).toBe(false)
})

test.skip('getRecentError', () => {
  const error = {
    violatedDirective: 'script-src-elem',
    sourceFile: 'http://localhost:3000/test.ts',
    lineNumber: 1,
    columnNumber: 11,
  }
  ContentSecurityPolicyErrorState.addError(error)
  expect(ContentSecurityPolicyErrorState.getRecentError()).toEqual(error)
})
