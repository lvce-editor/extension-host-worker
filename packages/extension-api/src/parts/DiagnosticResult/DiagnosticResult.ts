export const DiagnosticTag = {
  Deprecated: 2,
  Unnecessary: 1,
} as const

export interface Diagnostic {
  readonly code?: number | string
  readonly columnIndex: number
  readonly endColumnIndex: number
  readonly endRowIndex: number
  readonly message: string
  readonly rowIndex: number
  readonly source?: string
  readonly tags?: readonly number[]
  readonly type: string
  readonly uri?: string
}
