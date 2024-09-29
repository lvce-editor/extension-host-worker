import { expect, test } from '@jest/globals'
import * as WidgetModules from '../src/parts/WidgetModules/WidgetModules.ts'

test('register / get', () => {
  const id = 'test'
  const module = {}
  WidgetModules.register(id, module)
  expect(WidgetModules.get(id)).toBe(module)
})
