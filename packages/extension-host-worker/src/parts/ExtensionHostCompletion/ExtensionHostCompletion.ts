import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeCompletionProvider, executeresolveCompletionItemProvider, registerCompletionProvider } = Registry.create({
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

export { registerCompletionProvider, executeCompletionProvider, executeresolveCompletionItemProvider }
