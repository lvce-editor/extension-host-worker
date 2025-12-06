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
    { name: 'a', type: BabelNodeType.Identifier },
    { name: 'b', type: BabelNodeType.Identifier },
  ]
  const visitor = jest.fn()
  Walk.walk(nodes, visitor)
  expect(visitor).toHaveBeenCalledTimes(2)
  expect(visitor).toHaveBeenNthCalledWith(1, nodes[0])
  expect(visitor).toHaveBeenNthCalledWith(2, nodes[1])
})

test('walk - file node', () => {
  const node = {
    program: {
      body: [],
      type: BabelNodeType.Program,
    },
    type: BabelNodeType.File,
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.program)
})

test('walk - program node', () => {
  const node = {
    body: [{ name: 'test', type: BabelNodeType.Identifier }],
    type: BabelNodeType.Program,
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.body[0])
})

test('walk - export named declaration', () => {
  const node = {
    declaration: {
      declarations: [],
      type: BabelNodeType.VariableDeclaration,
    },
    type: BabelNodeType.ExportNamedDeclaration,
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.declaration)
})

test('walk - variable declaration', () => {
  const node = {
    declarations: [{ id: { name: 'x', type: BabelNodeType.Identifier }, type: BabelNodeType.VariableDeclarator }],
    type: BabelNodeType.VariableDeclaration,
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.declarations[0])
})

test('walk - arrow function expression', () => {
  const node = {
    body: {
      body: [],
      type: BabelNodeType.BlockStatement,
    },
    type: BabelNodeType.ArrowFunctionExpression,
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.body)
})

test('walk - expression statement', () => {
  const node = {
    expression: {
      callee: { name: 'test', type: BabelNodeType.Identifier },
      type: BabelNodeType.CallExpression,
    },
    type: BabelNodeType.ExpressionStatement,
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.expression)
})

test('walk - await expression', () => {
  const node = {
    argument: {
      callee: { name: 'test', type: BabelNodeType.Identifier },
      type: BabelNodeType.CallExpression,
    },
    type: BabelNodeType.AwaitExpression,
  }
  const visitor = jest.fn()
  Walk.walk(node, visitor)
  expect(visitor).toHaveBeenCalledWith(node)
  expect(visitor).toHaveBeenCalledWith(node.argument)
})

test('walk - call expression', () => {
  const node = {
    callee: {
      name: 'test',
      type: BabelNodeType.Identifier,
    },
    type: BabelNodeType.CallExpression,
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
