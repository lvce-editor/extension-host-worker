import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeHoverProvider, getProviders, registerHoverProvider, reset } = Registry.create({
  name: 'Hover',
  resultShape: {
    allowUndefined: true,
    properties: {},
    type: Types.Object,
  },
})

const getRegisteredHoverProviderIds = (): readonly string[] => {
  return getProviders().map((provider: any) => provider.id)
}

export { executeHoverProvider, getRegisteredHoverProviderIds, registerHoverProvider, reset }
