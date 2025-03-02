import { expect, jest, test } from '@jest/globals'
import * as Logger from '../src/parts/Logger/Logger.ts'

test('info', () => {
  const spy = jest.spyOn(console, 'info').mockImplementation(() => {})
  Logger.info('test message')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test message')
  spy.mockRestore()
})

test('warn', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  Logger.warn('test warning')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test warning')
  spy.mockRestore()
})

test('error', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  Logger.error('test error')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test error')
  spy.mockRestore()
})

test('info - multiple arguments', () => {
  const spy = jest.spyOn(console, 'info').mockImplementation(() => {})
  Logger.info('test', 123, { foo: 'bar' })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test', 123, { foo: 'bar' })
  spy.mockRestore()
})

test('warn - multiple arguments', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  Logger.warn('test', 123, { foo: 'bar' })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test', 123, { foo: 'bar' })
  spy.mockRestore()
})

test('error - multiple arguments', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  Logger.error('test', 123, { foo: 'bar' })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('test', 123, { foo: 'bar' })
  spy.mockRestore()
})
