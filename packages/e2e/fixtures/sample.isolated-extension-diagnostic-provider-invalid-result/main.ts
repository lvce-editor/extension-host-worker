import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerDiagnosticProvider({
    id: 'isolatedDiagnosticInvalidResult',
    languageId: 'javascript',
    provideDiagnostics() {
      return 42 as any
    },
  })
}
