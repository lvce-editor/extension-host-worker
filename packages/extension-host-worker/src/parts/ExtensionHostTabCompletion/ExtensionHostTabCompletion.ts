import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeTabCompletionProvider, registerTabCompletionProvider, reset } = Registry.create({
  name: 'TabCompletion',
  resultShape: {
    allowUndefined: true,
    type: Types.Object,
  },
})

export { registerTabCompletionProvider, executeTabCompletionProvider, reset }
