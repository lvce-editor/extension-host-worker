import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executeClosingTagProvider, registerClosingTagProvider } = Registry.create({
  name: 'ClosingTag',
  resultShape: {
    allowUndefined: true,
    type: Types.Object,
  },
  returnUndefinedWhenNoProviderFound: true,
})

export { registerClosingTagProvider, executeClosingTagProvider }
