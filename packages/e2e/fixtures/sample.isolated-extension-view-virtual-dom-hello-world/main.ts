import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

const H1 = 5
const Text = 12

const textNode = (text: string): any => {
  return {
    childCount: 0,
    text,
    type: Text,
  }
}

const h1Node = (childCount: number): any => {
  return {
    childCount,
    type: H1,
  }
}

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        render() {
          return [h1Node(1), textNode('Hello world')]
        },
      }
    },
    id: 'sample.views.virtualDomHelloWorld',
    kind: 'virtualDom',
  })
}
