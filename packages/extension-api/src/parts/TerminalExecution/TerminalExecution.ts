export interface TerminalExecution {
  readonly args: readonly string[]
  readonly command: string
  readonly cwd: string
}
