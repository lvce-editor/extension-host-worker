import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerDiagnosticProvider({
    id: 'isolatedDiagnosticError',
    languageId: 'javascript',
    provideDiagnostics() {
      throw new Error('isolated diagnostic failed')
    },
  })
}
