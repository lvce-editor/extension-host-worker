import * as Registry from '../Registry/Registry.ts'
import * as Types from '../Types/Types.ts'

const { registerCommentProvider, executeCommentProvider } = Registry.create({
  name: 'Comment',
  resultShape: {
    type: Types.Array,
    items: {
      type: Types.Object,
    },
  },
})

export { registerCommentProvider, executeCommentProvider }
