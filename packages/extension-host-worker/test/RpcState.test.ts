import { expect, test } from '@jest/globals'
import * as RpcState from '../src/parts/RpcState/RpcState.ts'

test('register', () => {
  const execute = () => {}
  const id = 'abc'
  RpcState.register(id, execute)
  expect(RpcState.acquire(id)).toBe(execute)
  expect(RpcState.acquire(id)).toBe(undefined)
})
