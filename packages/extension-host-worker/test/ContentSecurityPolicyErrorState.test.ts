import { beforeEach, expect, test } from '@jest/globals'
import * as ContentSecurityPolicyErrorState from '../src/parts/ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts'

beforeEach(() => {
  ContentSecurityPolicyErrorState.reset()
})

test('addError', () => {
  const error = {
    columnNumber: 11,
    lineNumber: 1,
    sourceFile: 'http://localhost:3000/test.ts',
    violatedDirective: 'script-src-elem',
  }
  ContentSecurityPolicyErrorState.addError(error)
  expect(ContentSecurityPolicyErrorState.hasRecentErrors()).toBe(true)
})

test('hasRecentErrors - no errors', () => {
  expect(ContentSecurityPolicyErrorState.hasRecentErrors()).toBe(false)
})

test.skip('getRecentError', () => {
  const error = {
    columnNumber: 11,
    lineNumber: 1,
    sourceFile: 'http://localhost:3000/test.ts',
    violatedDirective: 'script-src-elem',
  }
  ContentSecurityPolicyErrorState.addError(error)
  expect(ContentSecurityPolicyErrorState.getRecentError()).toEqual(error)
})
