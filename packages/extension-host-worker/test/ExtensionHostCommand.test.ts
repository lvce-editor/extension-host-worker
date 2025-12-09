import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostCommand from '../src/parts/ExtensionHostCommand/ExtensionHostCommand.ts'

beforeEach(() => {
  ExtensionHostCommand.reset()
})

test('registerCommand - no argument provided', () => {
  expect(() => {
    // @ts-ignore
    ExtensionHostCommand.registerCommand()
  }).toThrow(new Error('Failed to register command: command is not defined'))
})

test('registerCommand - missing id', () => {
  expect(() => {
    ExtensionHostCommand.registerCommand({
      execute() {},
    })
  }).toThrow(new Error('Failed to register command: command is missing id'))
})

test('registerCommand - missing execute function', () => {
  expect(() => {
    ExtensionHostCommand.registerCommand({
      id: 'test',
    })
  }).toThrow(new Error('Failed to register command test: command is missing execute function'))
})

test('executeCommand - not found', async () => {
  await expect(ExtensionHostCommand.executeCommand('xyz', 'abc')).rejects.toThrow(new Error('Failed to execute command: command xyz not found'))
})

test('executeCommand - error', async () => {
  ExtensionHostCommand.registerCommand({
    execute(query) {
      throw new TypeError('x is not a function')
    },
    id: 'xyz',
  })
  await expect(ExtensionHostCommand.executeCommand('xyz', 'abc')).rejects.toThrow(
    new Error('Failed to execute command: TypeError: x is not a function'),
  )
})

test('executeCommand - error - command is registered multiple times', async () => {
  ExtensionHostCommand.registerCommand({
    execute(query) {},
    id: 'xyz',
  })
  expect(() => {
    ExtensionHostCommand.registerCommand({
      execute(query) {},
      id: 'xyz',
    })
  }).toThrow(new Error('Failed to register command xyz: command cannot be registered multiple times'))
})

test('executeCommand - error - command is null', async () => {
  expect(() => {
    ExtensionHostCommand.registerCommand(null)
  }).toThrow(new Error('Failed to register command: command is null'))
})
