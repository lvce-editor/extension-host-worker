import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeBraceCompletionProvider, registerBraceCompletionProvider, reset } = Registry.create({
  name: 'BraceCompletion',
  resultShape: {
    type: Types.Boolean,
  },
})

export { registerBraceCompletionProvider, executeBraceCompletionProvider, reset }
