import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'
import type { ViewEvent } from '@lvce-editor/api'

const textNode = (text: string): any => {
  return {
    childCount: 0,
    text,
    type: 4,
  }
}

const elementNode = (className: string, childCount: number): any => {
  return {
    childCount,
    className,
    type: 1,
  }
}

const inputNode = (name: string, value: string): any => {
  return {
    childCount: 0,
    name,
    type: 1,
    value,
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
      let draft = ''
      let submitted = ''
      return {
        handleEvent(event: ViewEvent): void {
          if (event.type === 'input' && event.name === 'message') {
            draft = typeof event.value === 'string' ? event.value : ''
          }
          if ((event.type === 'click' && event.name === 'applyMessage') || event.type === 'submit') {
            submitted = draft
          }
        },
        render() {
          return [
            elementNode('VirtualDomEventSample', 5),
            textNode('Virtual DOM Event Sample'),
            inputNode('message', draft),
            buttonNode('applyMessage', 'Apply message'),
            textNode(`Draft: ${draft}`),
            textNode(`Submitted: ${submitted}`),
          ]
        },
        saveState() {
          return {
            draft,
            submitted,
          }
        },
      }
    },
    id: 'sample.views.virtualDomEvent',
    kind: 'virtualDom',
  })
}
