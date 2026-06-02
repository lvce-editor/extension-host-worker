export interface Diagnostic {
  readonly code?: number | string
  readonly columnIndex: number
  readonly endColumnIndex: number
  readonly endRowIndex: number
  readonly message: string
  readonly rowIndex: number
  readonly source?: string
  readonly type: string
  readonly uri?: string
}
