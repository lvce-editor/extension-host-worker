import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeDiagnosticProvider, registerDiagnosticProvider } = Registry.create({
  name: 'Diagnostic',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

export { executeDiagnosticProvider, registerDiagnosticProvider }
