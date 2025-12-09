import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeSelectionProvider, registerSelectionProvider, reset } = Registry.create({
  name: 'Selection',
  resultShape: {
    allowUndefined: true,
    items: {
      type: 'number',
    },
    type: Types.Array,
  },
})

export { executeSelectionProvider, registerSelectionProvider, reset }
