import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'
import type { ViewContext, ViewEvent } from '@lvce-editor/api'

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

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create(context?: ViewContext) {
      let disposed = false
      return {
        dispose(): void {
          disposed = true
        },
        handleEvent(_event: ViewEvent): void {},
        render() {
          return [
            elementNode('VirtualDomSample', 4),
            textNode('Virtual DOM Sample View'),
            textNode(`Context uid: ${context?.uid ?? 'unknown'}`),
            textNode('Rendered by an isolated extension'),
            textNode(`Disposed: ${disposed}`),
          ]
        },
        saveState() {
          return {
            lastRenderedUid: context?.uid ?? 0,
          }
        },
      }
    },
    id: 'sample.views.virtualDom',
    kind: 'virtualDom',
  })
}
