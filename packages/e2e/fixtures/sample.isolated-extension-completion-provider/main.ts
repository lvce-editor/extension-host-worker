import { activate, registerCompletionProvider } from '@lvce-editor/api'

const main = async (): Promise<void> => {
  await activate()
  registerCompletionProvider({
    id: 'isolatedCompletion',
    languageId: 'xyz',
    provideCompletions() {
      return [
        {
          label: 'isolatedResult',
          type: 1,
        },
      ]
    },
  })
}

await main()
