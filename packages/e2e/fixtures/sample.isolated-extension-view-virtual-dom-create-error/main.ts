import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      throw new Error('create failed')
    },
    id: 'sample.views.virtualDomCreateError',
    kind: 'virtualDom',
  })
}
