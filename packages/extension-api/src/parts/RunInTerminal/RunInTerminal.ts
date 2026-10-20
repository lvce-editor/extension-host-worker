import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { TerminalExecution } from '../TerminalExecution/TerminalExecution.ts'

/** Starts a process in a new integrated terminal. Requires the terminal.execute manifest permission. */
export const runInTerminal = async (execution: TerminalExecution): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.runInTerminal', execution)
}
