export type CommandCallback<TArgs extends readonly any[] = readonly any[], TResult = unknown> = (...args: TArgs) => TResult | Promise<TResult>
