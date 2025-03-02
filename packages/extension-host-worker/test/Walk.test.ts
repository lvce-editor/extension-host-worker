import { expect, test, jest } from '@jest/globals'
import * as BabelNodeType from '../src/parts/BabelNodeType/BabelNodeType.ts'
import * as Walk from '../src/parts/Walk/Walk.ts'

test('walk - empty node', () => {
  const visitor = jest.fn()
  Walk.walk(null, visitor)
  expect(visitor).not.toHaveBeenCalled()
})

test('walk - array of nodes', () => {
  const nodes = [
    { type: BabelNodeType.Identifier, name: 'a' },
    { type: BabelNodeType.Identifier, name: 'b' },
  ]
  const visitor = jest.fn()
  Walk.walk(nodes, visitor)
  expect(visitor).toHaveBeenCalledTimes(2)
  expect(visitor).toHaveBeenNthCalledWith(1, nodes[0])
  expect(visitor).toHaveBeenNthCalledWith(2, nodes[1])
})

test('walk - file node', () => {
  const node = {
    type: BabelNodeType.File,
    program: {
      type: BabelNodeType.Program,
      body: [],
    },
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.program)
})

test('walk - program node', () => {
  const node = {
    type: BabelNodeType.Program,
    body: [{ type: BabelNodeType.Identifier, name: 'test' }],
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.body[0])
})

test('walk - export named declaration', () => {
  const node = {
    type: BabelNodeType.ExportNamedDeclaration,
    declaration: {
      type: BabelNodeType.VariableDeclaration,
      declarations: [],
    },
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.declaration)
})

test('walk - variable declaration', () => {
  const node = {
    type: BabelNodeType.VariableDeclaration,
    declarations: [{ type: BabelNodeType.VariableDeclarator, id: { type: BabelNodeType.Identifier, name: 'x' } }],
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.declarations[0])
})

test('walk - arrow function expression', () => {
  const node = {
    type: BabelNodeType.ArrowFunctionExpression,
    body: {
      type: BabelNodeType.BlockStatement,
      body: [],
    },
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.body)
})

test('walk - expression statement', () => {
  const node = {
    type: BabelNodeType.ExpressionStatement,
    expression: {
      type: BabelNodeType.CallExpression,
      callee: { type: BabelNodeType.Identifier, name: 'test' },
    },
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.expression)
})

test('walk - await expression', () => {
  const node = {
    type: BabelNodeType.AwaitExpression,
    argument: {
      type: BabelNodeType.CallExpression,
      callee: { type: BabelNodeType.Identifier, name: 'test' },
    },
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.argument)
})

test('walk - call expression', () => {
  const node = {
    type: BabelNodeType.CallExpression,
    callee: {
      type: BabelNodeType.Identifier,
      name: 'test',
    },
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.callee)
})

test('walk - unknown node type', () => {
  const node = {
    type: 'UnknownType',
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
})
