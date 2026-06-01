import type { Disposable } from '../Disposable/Disposable.ts'

export interface StatusBarItemProviderHandle extends Disposable {
  readonly refresh: () => Promise<void>
}
