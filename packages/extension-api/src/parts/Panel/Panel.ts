import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export interface OpenDebugConsoleOptions {
  readonly input?: string
}

export interface OpenOutputViewOptions {
  readonly channel?: string
}

export interface OpenProblemsViewOptions {
  readonly filter?: string
}

export const openDebugConsole = async (options: OpenDebugConsoleOptions = {}): Promise<void> => {
  await executeCommand('Layout.openDebugConsole', options.input)
}

export const openOutputView = async (options: OpenOutputViewOptions = {}): Promise<void> => {
  await executeCommand('Layout.openOutput', options.channel)
}

export const openProblemsView = async (options: OpenProblemsViewOptions = {}): Promise<void> => {
  await executeCommand('Layout.openProblems', options.filter)
}
