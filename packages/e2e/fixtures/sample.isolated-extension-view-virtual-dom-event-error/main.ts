import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'
import type { ViewEvent } from '@lvce-editor/api'

const textNode = (text: string): any => {
  return {
    childCount: 0,
    text,
    type: 4,
  }
}

const buttonNode = (name: string, text: string): any => {
  return {
    childCount: 1,
    name,
    type: 1,
    value: text,
  }
}

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        handleEvent(event: ViewEvent): void {
          if (event.type === 'click' && event.name === 'failEvent') {
            throw new Error('event failed')
          }
        },
        render() {
          return [textNode('Virtual DOM Event Error Sample'), buttonNode('failEvent', 'Fail event')]
        },
      }
    },
    id: 'sample.views.virtualDomEventError',
    kind: 'virtualDom',
  })
}
