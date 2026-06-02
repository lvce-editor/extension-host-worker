export type CommandCallback<TArgs extends readonly unknown[] = readonly unknown[], TResult = unknown> = (...args: TArgs) => TResult | Promise<TResult>
