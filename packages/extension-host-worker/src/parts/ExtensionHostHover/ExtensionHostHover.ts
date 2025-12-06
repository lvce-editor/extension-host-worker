import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeHoverProvider, registerHoverProvider, reset } = Registry.create({
  name: 'Hover',
  resultShape: {
    allowUndefined: true,
    properties: {},
    type: Types.Object,
  },
})

export { executeHoverProvider, registerHoverProvider, reset }
