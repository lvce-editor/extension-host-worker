import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {},
    id: 'sample.views.notContributed',
  })
}
