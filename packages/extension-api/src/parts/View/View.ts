import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'

export type ViewKind = 'virtualDom'

export interface ViewContext {
  readonly requestRerender: () => Promise<void>
  readonly showContextMenu: (menuId: string, x: number, y: number) => Promise<void>
  readonly state?: unknown
  readonly uid: number
  readonly viewId: string
}

export interface ViewEvent {
  readonly name?: string
  readonly type: string
  readonly value?: unknown
  readonly x?: number
  readonly y?: number
}

export interface MenuEntry {
  readonly args?: readonly unknown[]
  readonly command: string
  readonly flags?: number
  readonly id: string
  readonly label: string
}

export interface DomEventListener {
  readonly capture?: boolean
  readonly name: string | number
  readonly params: readonly string[]
  readonly passive?: boolean
  readonly preventDefault?: boolean
  readonly stopPropagation?: boolean
}

export interface VirtualDomViewInstance {
  readonly dispose?: () => unknown
  readonly getContext?: () => Readonly<Record<string, boolean>>
  readonly getMenuEntries?: (menuId: string) => readonly MenuEntry[] | Promise<readonly MenuEntry[]>
  readonly handleEvent?: (event: ViewEvent) => unknown
  readonly render: () => readonly VirtualDomNode[] | Promise<readonly VirtualDomNode[]>
  readonly renderFocus?: (oldContext: Readonly<Record<string, boolean>>, newContext: Readonly<Record<string, boolean>>) => string | Promise<string>
  readonly saveState?: () => unknown
}

export interface View {
  readonly create: (context?: ViewContext) => unknown
  readonly displayName?: string
  readonly eventListeners?: readonly DomEventListener[]
  readonly icon?: string
  readonly id: string
  readonly kind?: ViewKind
  readonly name?: string
  readonly title?: string
}

export interface RegisteredView {
  readonly displayName?: string
  readonly eventListeners?: readonly DomEventListener[]
  readonly icon?: string
  readonly id: string
  readonly kind?: ViewKind
  readonly name?: string
  readonly title?: string
}

export interface ViewRegistrySnapshot {
  readonly views: readonly RegisteredView[]
}

export interface ViewRenderResultDom {
  readonly dom: readonly VirtualDomNode[]
  readonly focusSelector?: string
  readonly type: 'setDom'
}

export interface ViewRenderResultPatches {
  readonly focusSelector?: string
  readonly patches: readonly unknown[]
  readonly type: 'setPatches'
}

export type ViewRenderResult = ViewRenderResultDom | ViewRenderResultPatches
