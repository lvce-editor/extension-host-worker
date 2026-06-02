import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeDiagnosticProvider, getProviders, registerDiagnosticProvider, reset } = Registry.create({
  name: 'Diagnostic',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

const getRegisteredDiagnosticProviderIds = (): readonly string[] => {
  return getProviders().map((provider: any) => provider.id)
}

export { executeDiagnosticProvider, getRegisteredDiagnosticProviderIds, registerDiagnosticProvider, reset }
