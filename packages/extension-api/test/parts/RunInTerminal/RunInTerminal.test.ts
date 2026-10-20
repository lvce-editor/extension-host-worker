import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects } from 'node:assert/strict'
import { test } from 'node:test'
import { runInTerminal } from '../../../src/parts/RunInTerminal/RunInTerminal.ts'

test('terminal API uses the permission-scoped RPC and preserves process arguments', async () => {
  const calls: unknown[] = []
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.runInTerminal'(execution: unknown): Promise<void> {
      calls.push(execution)
    },
  })
  const execution = { args: ['/workspace/a ; $(touch nope).js'], command: 'node', cwd: '/workspace' }
  await runInTerminal(execution)
  deepStrictEqual(calls, [execution])
})

test('terminal API reports denied permissions', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.runInTerminal'(): Promise<void> {
      throw new Error('requires the terminal.execute permission')
    },
  })
  await rejects(runInTerminal({ args: [], command: 'node', cwd: '/workspace' }), /requires the terminal.execute permission/)
})
