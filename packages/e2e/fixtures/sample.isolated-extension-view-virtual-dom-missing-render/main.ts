import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'
import type { ViewEvent } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        handleEvent(_event: ViewEvent): void {},
      }
    },
    id: 'sample.views.virtualDomMissingRender',
    kind: 'virtualDom',
  })
}
