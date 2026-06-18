import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        render() {
          return 42 as any
        },
      }
    },
    id: 'sample.views.virtualDomInvalidRenderResult',
    kind: 'virtualDom',
  })
}
