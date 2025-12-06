import * as Registry from '../Registry/Registry.ts'

const { executeCommentProvider, registerCommentProvider } = Registry.create({
  name: 'Comment',
  resultShape() {
    return ''
  },
})

export { executeCommentProvider, registerCommentProvider }
