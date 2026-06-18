import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        render() {
          throw new Error('render failed')
        },
      }
    },
    id: 'sample.views.virtualDomRenderError',
    kind: 'virtualDom',
  })
}
