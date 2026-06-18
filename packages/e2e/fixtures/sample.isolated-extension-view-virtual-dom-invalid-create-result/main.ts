import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return 42
    },
    id: 'sample.views.virtualDomInvalidCreateResult',
    kind: 'virtualDom',
  })
}
