import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerReferenceProvider, executeReferenceProvider, executefileReferenceProvider, reset, getProvider } = Registry.create({
  name: 'Reference',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
  additionalMethodNames: [
    // @ts-ignore
    {
      name: 'fileReference',
      methodName: 'provideFileReferences',
      resultShape: {
        type: Types.Array,
        items: {
          type: Types.Object,
        },
      },
    },
  ],
})

export { registerReferenceProvider, executeReferenceProvider, executefileReferenceProvider, reset }

export const executeReferenceProvider2 = ({
  uri,
  offset,
  languageId,
  position,
}: {
  uri: string
  offset: number
  languageId: string
  position: any
}) => {
  const provider = getProvider(languageId)
  return provider.getReferences({
    uri,
    offset,
    position,
  })
}
