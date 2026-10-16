export interface ShowDialogOptions {
  readonly closeMessage?: string
  readonly confirmMessage?: string
  readonly message: string
  readonly title: string
  readonly type?: 'error' | 'info' | 'warning'
}
