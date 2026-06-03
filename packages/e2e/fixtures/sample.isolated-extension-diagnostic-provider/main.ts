import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerDiagnosticProvider({
    id: 'isolatedDiagnostic',
    languageId: 'xyz',
    provideDiagnostics() {
      return [
        {
          rowIndex: 0,
          columnIndex: 6,
          endRowIndex: 0,
          endColumnIndex: 11,
          message: 'isolated diagnostic result',
          source: 'isolated',
          type: 'error',
        },
      ]
    },
  })
}
