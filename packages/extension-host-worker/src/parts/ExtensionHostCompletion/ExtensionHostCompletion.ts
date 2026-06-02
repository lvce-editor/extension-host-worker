import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeCompletionProvider, executeresolveCompletionItemProvider, getProviders, registerCompletionProvider, reset } = Registry.create({
  additionalMethodNames: [
    // @ts-ignore
    {
      methodName: 'resolveCompletionItem',
      name: 'resolveCompletionItem',
      resultShape: {
        allowUndefined: true,
        type: Types.Object,
      },
    },
  ],
  name: 'Completion',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

const getRegisteredCompletionProviderIds = (): readonly string[] => {
  return getProviders().map((provider: any) => provider.id)
}

export { registerCompletionProvider, executeCompletionProvider, executeresolveCompletionItemProvider, getRegisteredCompletionProviderIds, reset }
