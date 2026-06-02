import { afterEach, test } from 'node:test'
import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import {
  executeCommand,
  getCommandRegistrySnapshot,
  registerCommand,
  resetCommandRegistry,
} from '../../../src/parts/CommandRegistry/CommandRegistry.ts'

afterEach(() => {
  resetCommandRegistry()
})

test('registerCommand registers and executes a command', async () => {
  const disposable = registerCommand({
    execute(value: string): string {
      return value.toUpperCase()
    },
    id: 'sample.run',
  })

  strictEqual(getCommandRegistrySnapshot().commands.length, 1)
  strictEqual(await executeCommand('sample.run', 'ready'), 'READY')

  disposable.dispose()
  strictEqual(getCommandRegistrySnapshot().commands.length, 0)
})

test('registerCommand rejects undefined command', () => {
  throws(() => {
    // @ts-expect-error testing invalid command shape
    registerCommand(undefined)
  }, /command is not defined/)
})

test('registerCommand rejects missing id', () => {
  throws(() => {
    registerCommand({
      execute(): void {},
      // @ts-expect-error testing invalid command shape
      id: undefined,
    })
  }, /command is missing id/)
})

test('registerCommand rejects missing execute function', () => {
  throws(() => {
    registerCommand({
      // @ts-expect-error testing invalid command shape
      execute: undefined,
      id: 'sample.invalid',
    })
  }, /command sample\.invalid is missing execute function/)
})

test('registerCommand rejects duplicate command id', () => {
  registerCommand({
    execute(): void {},
    id: 'sample.run',
  })

  throws(() => {
    registerCommand({
      execute(): void {},
      id: 'sample.run',
    })
  }, /command sample\.run is already registered/)
})

test('executeCommand rejects unknown command id', async () => {
  await rejects(() => executeCommand('missing.command'), /command missing\.command not found/)
})

test('getCommandRegistrySnapshot returns registered commands', () => {
  registerCommand({
    execute(): string {
      return 'ok'
    },
    id: 'sample.run',
  })

  deepStrictEqual(
    getCommandRegistrySnapshot().commands.map((command) => command.id),
    ['sample.run'],
  )
})
