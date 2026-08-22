import {
  activate as activateExtensionApi,
  executeEditorGutterDecorationProvider,
  registerCommand,
  registerEditorGutterDecorationProvider,
} from '@lvce-editor/api'

await activateExtensionApi()
registerEditorGutterDecorationProvider({
  id: 'isolatedEditorGutterDecoration',
  provideEditorGutterDecorations(textDocument) {
    return textDocument.text.includes('modified')
      ? [
          { rowIndex: 0, type: 'added' },
          { rowIndex: 1, type: 'modified' },
          { rowIndex: 2, type: 'deleted' },
        ]
      : []
  },
})
registerCommand({
  execute(text: string, uri: string) {
    return executeEditorGutterDecorationProvider({ languageId: 'plaintext', text, uri })
  },
  id: 'isolatedEditorGutterDecoration.getDecorations',
})
