import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

const H1 = 5
const Text = 12

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        render() {
          return [
            {
              childCount: 1,
              type: H1,
            },
            {
              childCount: 0,
              text: 'Preview content',
              type: Text,
            },
          ]
        },
      }
    },
    id: 'sample.views.preferredPreview',
    kind: 'virtualDom',
    preferredLocation: 'preview',
  })
}
