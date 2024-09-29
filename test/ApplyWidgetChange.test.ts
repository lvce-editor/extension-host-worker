import { beforeEach, expect, test } from '@jest/globals'
import * as ApplyWidgetChange from '../src/parts/ApplyWidgetChange/ApplyWidgetChange.ts'
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

test('applyWidgetChange - type', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    id: 'test',
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      origin: EditOrigin.EditorType,
      inserted: ['a'],
      deleted: [],
    },
  ]
  expect(ApplyWidgetChange.applyWidgetChange(editor, widget, changes).newState).toEqual({
    updated: true,
  })
})

test('applyWidgetChange - deleteLeft', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    id: 'test',
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      origin: EditOrigin.DeleteLeft,
      inserted: [''],
      deleted: ['a'],
    },
  ]
  expect(ApplyWidgetChange.applyWidgetChange(editor, widget, changes).newState).toEqual({
    updated: true,
  })
})

test('applyWidgetChange - other', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const widget = {
    id: 'test',
    oldState: {
      updated: false,
    },
    newState: {
      updated: false,
    },
  }
  const changes = [
    {
      origin: EditOrigin.Unknown,
      inserted: ['a'],
      deleted: [],
    },
  ]
  expect(ApplyWidgetChange.applyWidgetChange(editor, widget, changes).newState).toEqual({
    updated: false,
  })
})
