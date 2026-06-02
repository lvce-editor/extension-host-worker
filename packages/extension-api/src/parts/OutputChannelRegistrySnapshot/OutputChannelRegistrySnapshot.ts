import type { RegisteredOutputChannel } from '../RegisteredOutputChannel/RegisteredOutputChannel.ts'

export interface OutputChannelRegistrySnapshot {
  readonly outputChannels: readonly RegisteredOutputChannel[]
}
