import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeDefinitionProvider, registerDefinitionProvider, reset } = Registry.create({
  name: 'Definition',
  resultShape: {
    allowUndefined: true,
    properties: {
      endOffset: {
        type: Types.Number,
      },
      startOffset: {
        type: Types.Number,
      },
      uri: {
        type: Types.String,
      },
    },
    type: Types.Object,
  },
})

export { registerDefinitionProvider, executeDefinitionProvider, reset }
