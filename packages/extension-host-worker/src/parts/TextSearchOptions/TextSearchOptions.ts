export interface TextSearchOptions {
  readonly assetDir: string
  readonly exclude: string
  readonly include: string
  readonly isCaseSensitive: boolean
  readonly query: string
  readonly root: string
  readonly scheme: string

  readonly threads: number
  readonly useRegularExpression: boolean
}
