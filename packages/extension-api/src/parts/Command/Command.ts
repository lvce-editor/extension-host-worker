import type { CommandCallback } from '../CommandCallback/CommandCallback.ts'

export interface Command<TArgs extends readonly any[] = readonly any[], TResult = unknown> {
  readonly execute: CommandCallback<TArgs, TResult>
  readonly id: string
}
