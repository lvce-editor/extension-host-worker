export type EditorGutterDecorationType = 'added' | 'deleted' | 'modified'

export interface EditorGutterDecoration {
  readonly rowIndex: number
  readonly type: EditorGutterDecorationType
}
