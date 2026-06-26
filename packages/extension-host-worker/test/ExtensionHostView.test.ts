import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostView from '../src/parts/ExtensionHostView/ExtensionHostView.ts'

const textNode = (text: string): any => {
  return {
    childCount: 0,
    text,
    type: 12,
  }
}

beforeEach(() => {
  ExtensionHostView.reset()
})

test('registerView - missing create function', () => {
  expect(() => {
    ExtensionHostView.registerView({
      id: 'sample.views.testing',
    })
  }).toThrow(new Error('Failed to register view sample.views.testing: view is missing create function'))
})

test('createViewInstance - renders initial virtual dom', async () => {
  ExtensionHostView.registerView({
    create(context: any) {
      return {
        render() {
          return [textNode(`uid:${context.uid}`)]
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await expect(ExtensionHostView.createViewInstance('sample.views.testing', 1)).resolves.toEqual({
    dom: [textNode('uid:1')],
    type: 'setDom',
  })
})

test('dispatchViewEvent - returns patches after handling event', async () => {
  let value = ''
  ExtensionHostView.registerView({
    create() {
      return {
        handleEvent(event: any) {
          value = `${event.value}`
        },
        render() {
          return [textNode(value)]
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await ExtensionHostView.createViewInstance('sample.views.testing', 1)
  const result = await ExtensionHostView.dispatchViewEvent(1, {
    type: 'input',
    value: 'abc',
  })

  expect(result.type).toBe('setPatches')
})

test('saveViewInstanceState - returns saved state', async () => {
  ExtensionHostView.registerView({
    create() {
      return {
        render() {
          return []
        },
        saveState() {
          return {
            value: 'abc',
          }
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await ExtensionHostView.createViewInstance('sample.views.testing', 1)
  await expect(ExtensionHostView.saveViewInstanceState(1)).resolves.toEqual({
    value: 'abc',
  })
})

test('disposeViewInstance - disposes and removes instance', async () => {
  let disposed = false
  ExtensionHostView.registerView({
    create() {
      return {
        dispose() {
          disposed = true
        },
        render() {
          return []
        },
      }
    },
    id: 'sample.views.testing',
    kind: 'virtualDom',
  })

  await ExtensionHostView.createViewInstance('sample.views.testing', 1)
  await ExtensionHostView.disposeViewInstance(1)

  expect(disposed).toBe(true)
  await expect(ExtensionHostView.dispatchViewEvent(1, { type: 'click' })).rejects.toThrow(new Error('view instance 1 not found'))
})
