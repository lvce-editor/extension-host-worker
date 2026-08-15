import type { Disposable } from '../Disposable/Disposable.ts'

export interface StatusBarItemProviderHandle extends Disposable {
  dispose(): Promise<void>
  readonly refresh: () => Promise<void>
}
