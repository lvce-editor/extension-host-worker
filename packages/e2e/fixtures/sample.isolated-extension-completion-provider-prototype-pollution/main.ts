import { activate, executeCompletionProvider, registerCommand, registerCompletionProvider } from '@lvce-editor/api'

let requestCount = 0

const main = async (): Promise<void> => {
  await activate()
  registerCommand({
    id: 'isolatedCompletionPrototypePollution.getCompletions',
    async execute() {
      return executeCompletionProvider({ languageId: 'javascript', text: 'const value', uri: '/test.js' }, 0)
    },
  })
  registerCompletionProvider({
    id: 'isolatedCompletionPrototypePollution',
    languageId: 'javascript',
    provideCompletions() {
      requestCount++
      if (requestCount === 1) {
        return [JSON.parse('{"label":"prototype completion","type":1,"__proto__":{"polluted":true}}')]
      }
      return [{ label: 'clean completion', type: 1 }]
    },
  })
}

await main()
