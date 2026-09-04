import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderStatusBarItems() {
          return [{ name: 'invalid-status', text: 42 }] as any
        },
      }
    },
    id: 'sample.views.statusBarItemsInvalidItem',
    kind: 'virtualDom',
    preferredLocation: 'preview',
  })
}
