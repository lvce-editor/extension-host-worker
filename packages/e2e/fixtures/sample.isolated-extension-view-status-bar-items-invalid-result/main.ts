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
          return 'invalid' as any
        },
      }
    },
    id: 'sample.views.statusBarItemsInvalidResult',
    kind: 'virtualDom',
    preferredLocation: 'preview',
  })
}
