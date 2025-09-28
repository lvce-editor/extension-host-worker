import * as Registry from '../Registry/Registry.ts'

const { registerCommentProvider, executeCommentProvider } = Registry.create({
  name: 'Comment',
  resultShape() {
    return ''
  },
})

export { executeCommentProvider, registerCommentProvider }
