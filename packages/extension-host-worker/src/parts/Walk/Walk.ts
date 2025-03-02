import * as BabelNodeType from '../BabelNodeType/BabelNodeType.ts'

export const walk = (node, visitor): void => {
  if (!node) {
    return
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      walk(item, visitor)
    }
    return
  }
  visitor(node)
  switch (node.type) {
    case BabelNodeType.File:
      walk(node.program, visitor)
      break
    case BabelNodeType.Program:
      walk(node.body, visitor)
      break
    case BabelNodeType.ExportNamedDeclaration:
      walk(node.declaration, visitor)
      break
    case BabelNodeType.VariableDeclaration:
      walk(node.declarations, visitor)
      break
    case BabelNodeType.VariableDeclarator:
      walk(node.init, visitor)
      break
    case BabelNodeType.ArrowFunctionExpression:
      walk(node.body, visitor)
      break
    case BabelNodeType.BlockStatement:
      walk(node.body, visitor)
      break
    case BabelNodeType.ExpressionStatement:
      walk(node.expression, visitor)
      break
    case BabelNodeType.AwaitExpression:
      walk(node.argument, visitor)
      break
    case BabelNodeType.CallExpression:
      walk(node.callee, visitor)
      break
    default:
      break
  }
}
