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

export interface ViewAction {
  readonly command: string
  readonly icon: string
  readonly title: string
}

export interface ViewSelection {
  readonly end: number
  readonly name: string
  readonly start: number
}

export type ViewScrollPosition = readonly [selector: string, scrollTop: number]

export interface DomEventListener {
  readonly capture?: boolean
  readonly name: string | number
  readonly params: readonly string[]
  readonly passive?: boolean
  readonly preventDefault?: boolean
  readonly stopPropagation?: boolean
  readonly trackPointerEvents?: readonly (string | number)[]
}

export interface VirtualDomViewInstance {
  readonly dispose?: () => unknown
  readonly getContext?: () => Readonly<Record<string, boolean>>
  readonly getMenuEntries?: (menuId: string) => readonly MenuEntry[] | Promise<readonly MenuEntry[]>
  readonly handleEvent?: (event: ViewEvent) => unknown
  readonly render: () => readonly VirtualDomNode[] | Promise<readonly VirtualDomNode[]>
  readonly renderActions?: () => readonly ViewAction[] | Promise<readonly ViewAction[]>
  readonly renderFocus?: (oldContext: Readonly<Record<string, boolean>>, newContext: Readonly<Record<string, boolean>>) => string | Promise<string>
  readonly renderScrollPosition?: () => readonly [] | ViewScrollPosition | Promise<readonly [] | ViewScrollPosition>
  readonly renderSelections?: () => readonly ViewSelection[] | Promise<readonly ViewSelection[]>
  readonly renderTitle?: () => string | Promise<string>
  readonly saveState?: () => unknown
}

export type ViewCommand<State = VirtualDomViewInstance, Args extends readonly any[] = readonly any[]> = (
  state: State,
  ...args: Args
) => State | Promise<State>

export interface View<State = unknown> {
  readonly commands?: Readonly<Record<string, ViewCommand<State>>>
  readonly create: (context?: ViewContext) => State | Promise<State>
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
  readonly scrollPosition?: ViewScrollPosition
  readonly selections?: readonly ViewSelection[]
  readonly title?: string
  readonly type: 'setDom'
}

export interface ViewRenderResultPatches {
  readonly focusSelector?: string
  readonly patches: readonly unknown[]
  readonly scrollPosition?: ViewScrollPosition
  readonly selections?: readonly ViewSelection[]
  readonly title?: string
  readonly type: 'setPatches'
}

export type ViewRenderResult = ViewRenderResultDom | ViewRenderResultPatches
