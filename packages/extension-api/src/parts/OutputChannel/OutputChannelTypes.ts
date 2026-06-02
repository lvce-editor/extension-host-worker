export interface OutputChannelRegistrySnapshot {
  readonly outputChannels: readonly RegisteredOutputChannel[]
}

export interface RegisteredOutputChannel {
  readonly id: string
}

export interface OutputChannel {
  append(text: string): Promise<void>
  appendLine(text: string): Promise<void>
  clear(): Promise<void>
  replace(text: string): Promise<void>
}
