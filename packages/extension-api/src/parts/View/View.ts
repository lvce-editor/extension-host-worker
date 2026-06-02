export interface View {
  readonly create: () => unknown
  readonly icon?: string
  readonly id: string
  readonly title?: string
}

export interface RegisteredView {
  readonly icon?: string
  readonly id: string
  readonly title?: string
}

export interface ViewRegistrySnapshot {
  readonly views: readonly RegisteredView[]
}
