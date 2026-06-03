import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerDiagnosticProvider({
    id: 'isolatedDiagnosticMissingContribution',
    languageId: 'javascript',
    provideDiagnostics() {
      return []
    },
  })
}
