import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

const provider = {
  id: 'isolatedDiagnosticDuplicate',
  languageId: 'javascript',
  provideDiagnostics() {
    return []
  },
}

export const activate = (): void => {
  activateExtensionApi()
  registerDiagnosticProvider(provider)
  registerDiagnosticProvider(provider)
}
