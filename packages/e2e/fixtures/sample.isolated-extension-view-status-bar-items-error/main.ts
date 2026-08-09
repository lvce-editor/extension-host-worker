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
          throw new Error('status bar render failed')
        },
      }
    },
    id: 'sample.views.statusBarItemsError',
    kind: 'virtualDom',
    preferredLocation: 'preview',
  })
}
