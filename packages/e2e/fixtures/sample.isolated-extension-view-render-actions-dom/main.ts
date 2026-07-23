import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

const Button = 1
const Div = 4
const Text = 12

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderActionsDom() {
          return [
            {
              childCount: 1,
              className: 'Actions',
              role: 'toolbar',
              type: Div,
            },
            {
              childCount: 1,
              className: 'CustomSidebarAction',
              title: 'Custom sidebar action',
              type: Button,
            },
            {
              childCount: 0,
              text: 'Custom action',
              type: Text,
            },
          ]
        },
      }
    },
    id: 'sample.views.renderActionsDom',
    kind: 'virtualDom',
  })
}
