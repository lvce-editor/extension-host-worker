import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeImplementationProvider, registerImplementationProvider, reset } = Registry.create({
  name: 'Implementation',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

export { registerImplementationProvider, executeImplementationProvider, reset }
