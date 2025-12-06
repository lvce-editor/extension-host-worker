import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeFormattingProvider, registerFormattingProvider, reset } = Registry.create({
  executeKey: 'format',
  name: 'Formatting',
  resultShape: {
    allowUndefined: true,
    items: {
      properties: {
        endOffset: {
          type: Types.Number,
        },
        inserted: {
          type: Types.String,
        },
        startOffset: {
          type: Types.Number,
        },
      },
      type: Types.Object,
    },
    type: Types.Array,
  },
})

export { registerFormattingProvider, executeFormattingProvider, reset }
