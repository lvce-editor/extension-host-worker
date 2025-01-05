import { test, expect } from '@jest/globals'
import * as Arrays from '../src/parts/Arrays/Arrays.ts'

test('push - adds items to empty array', () => {
  const array: number[] = []
  Arrays.push(array, [1, 2, 3])
  expect(array).toEqual([1, 2, 3])
})

test('push - adds items to existing array', () => {
  const array = [1, 2]
  Arrays.push(array, [3, 4])
  expect(array).toEqual([1, 2, 3, 4])
})

test('push - handles empty items array', () => {
  const array = [1, 2]
  Arrays.push(array, [])
  expect(array).toEqual([1, 2])
})

test('fromAsync - converts async iterable to array', async () => {
  const asyncIterable = {
    async *[Symbol.asyncIterator]() {
      yield 1
      yield 2
      yield 3
    },
  }
  const result = await Arrays.fromAsync(asyncIterable)
  expect(result).toEqual([1, 2, 3])
})

test('fromAsync - handles empty async iterable', async () => {
  const asyncIterable = {
    async *[Symbol.asyncIterator]() {},
  }
  const result = await Arrays.fromAsync(asyncIterable)
  expect(result).toEqual([])
})
