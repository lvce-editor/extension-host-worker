import { activate } from '../src/parts/Activation/Activation.ts'
import { getCommandRegistrySnapshot, registerCommand, resetCommandRegistry } from '../src/parts/Command/Command.ts'

const strictEqual = (actual: unknown, expected: unknown): void => {
  if (actual !== expected) {
    throw new Error(`Expected ${actual} to equal ${expected}`)
  }
}

const throws = (fn: () => void, expected: RegExp): void => {
  try {
    fn()
  } catch (error) {
    if (error instanceof Error && expected.test(error.message)) {
      return
    }
    throw error
  }
  throw new Error(`Expected function to throw ${expected}`)
}

resetCommandRegistry()

const activation = activate(() => {
  return undefined
})

strictEqual(typeof activation, 'function')

const disposable = registerCommand({
  execute(value: string): string {
    return value.toUpperCase()
  },
  id: 'sample.run',
})

strictEqual(getCommandRegistrySnapshot().commands.length, 1)

throws(() => {
  registerCommand({
    execute(): void {},
    id: 'sample.run',
  })
}, /command sample\.run is already registered/)

disposable.dispose()
strictEqual(getCommandRegistrySnapshot().commands.length, 0)
