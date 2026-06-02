import type { CommandCallback } from '../CommandCallback/CommandCallback.ts'

export interface Command<TArgs extends readonly unknown[] = readonly unknown[], TResult = unknown> {
  readonly execute: CommandCallback<TArgs, TResult>
  readonly id: string
}
