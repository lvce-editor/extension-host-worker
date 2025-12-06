import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeTypeDefinitionProvider, registerTypeDefinitionProvider, reset } = Registry.create({
  name: 'TypeDefinition',
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

export { registerTypeDefinitionProvider, executeTypeDefinitionProvider, reset }
