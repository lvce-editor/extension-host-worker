import { activate as activateExtensionApi, executeDiagnosticProvider, registerCommand, registerDiagnosticProvider } from '@lvce-editor/api'

let requestCount = 0

const main = async (): Promise<void> => {
  await activateExtensionApi()
  registerCommand({
    id: 'isolatedDiagnosticPrototypePollution.getDiagnostics',
    async execute() {
      return executeDiagnosticProvider({ languageId: 'javascript', text: 'const value = 1', uri: '/test.js' })
    },
  })
  registerDiagnosticProvider({
    id: 'isolatedDiagnosticPrototypePollution',
    languageId: 'javascript',
    provideDiagnostics() {
      requestCount++
      if (requestCount === 1) {
        return JSON.parse(
          '[{"rowIndex":0,"columnIndex":0,"endRowIndex":0,"endColumnIndex":5,"message":"prototype payload","source":"isolated","type":"error","__proto__":{"polluted":true}}]',
        )
      }
      return [{ rowIndex: 0, columnIndex: 0, endRowIndex: 0, endColumnIndex: 5, message: 'clean diagnostic', source: 'isolated', type: 'error' }]
    },
  })
}

await main()
