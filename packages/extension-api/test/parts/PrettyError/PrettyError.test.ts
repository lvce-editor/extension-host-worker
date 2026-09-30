import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { preparePrettyError } from '../../../src/parts/PrettyError/PrettyError.ts'

let mockRpc: { [Symbol.dispose](): void } | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('preparePrettyError asks the renderer to format the serialized error', async () => {
  const error = new Error('Syntax error')
  error.stack = 'SyntaxError: Syntax error\n    at file:///workspace/example.js:2:3'
  const codeFrame = '  1 | const value = 1\n> 2 | const = 2\n    |       ^'
  const calls: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, value: unknown): Promise<unknown> {
      calls.push([id, value])
      return { ...(value as object), codeFrame }
    },
  })

  const prettyError = await preparePrettyError(error)

  strictEqual(prettyError.codeFrame, codeFrame)
  deepStrictEqual(calls, [
    [
      'ErrorHandling.preparePrettyError',
      {
        code: undefined,
        codeFrame: undefined,
        constructor: { name: 'Error' },
        message: 'Syntax error',
        name: 'Error',
        stack: error.stack,
      },
    ],
  ])
})

test('preparePrettyError returns the original diagnostic when formatting is unavailable', async () => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(): Promise<never> {
      throw new Error('renderer unavailable')
    },
  })

  const prettyError = await preparePrettyError({
    errorMessage: 'could not parse',
    errorStack: 'SyntaxError: could not parse',
  })

  deepStrictEqual(prettyError, {
    code: undefined,
    codeFrame: undefined,
    constructor: undefined,
    message: 'could not parse',
    name: undefined,
    stack: 'SyntaxError: could not parse',
  })
})
