import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyWidgetChanges from '../src/parts/ApplyWidgetChanges/ApplyWidgetChanges.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as WidgetModules from '../src/parts/WidgetModules/WidgetModules.ts'

beforeEach(() => {
  WidgetModules.register('test', {
    handleEditorType(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
    handleEditorDeleteLeft(editor: any, state: any) {
      return {
        ...state,
        updated: true,
      }
    },
  })
})

test('applyWidgetChanges - delete', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    widgets: [
      {
        id: 'test',
        oldState: {
          updated: false,
        },
        newState: {
          updated: false,
        },
      },
    ],
  }
  const changes = [
    {
      origin: EditOrigin.DeleteLeft,
      inserted: [''],
      deleted: ['a'],
    },
  ]
  expect(ApplyWidgetChanges.applyWidgetChanges(editor, changes)).toEqual([
    {
      id: 'test',
      oldState: {
        updated: false,
      },
      newState: {
        updated: true,
      },
    },
  ])
})

test('applyWidgetChanges - empty widgets', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
    widgets: [],
  }
  const changes = [
    {
      origin: EditOrigin.DeleteLeft,
      inserted: [''],
      deleted: ['a'],
    },
  ]
  expect(ApplyWidgetChanges.applyWidgetChanges(editor, changes)).toEqual([])
})
