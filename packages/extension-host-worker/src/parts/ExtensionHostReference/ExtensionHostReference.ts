import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { executefileReferenceProvider, executeReferenceProvider, getProvider, registerReferenceProvider, reset } = Registry.create({
  additionalMethodNames: [
    // @ts-ignore
    {
      methodName: 'provideFileReferences',
      name: 'fileReference',
      resultShape: {
        items: {
          type: Types.Object,
        },
        type: Types.Array,
      },
    },
  ],
  name: 'Reference',
  resultShape: {
    items: {
      type: Types.Object,
    },
    type: Types.Array,
  },
})

export { registerReferenceProvider, executeReferenceProvider, executefileReferenceProvider, reset }

export const executeReferenceProvider2 = (uri: string, languageId: string, offset: number, position: any) => {
  const provider = getProvider(languageId)
  return provider.provideReferences2({
    offset,
    position,
    uri,
  })
}
