import * as BabelNodeType from '../BabelNodeType/BabelNodeType.ts'
import * as Walk from '../Walk/Walk.ts'

export const getBabelAstDependencies = (code, ast) => {
  const { program } = ast
  const { body } = program
  const dependencies = []
  for (const node of body) {
    if (node.type === BabelNodeType.ImportDeclaration || node.type === BabelNodeType.ExportAllDeclaration) {
      const relativePath = node.source.extra.rawValue
      const { start } = node.source
      const { end } = node.source
      // @ts-ignore
      dependencies.push({ code, end, relativePath, start })
    } else if (
      node.type === BabelNodeType.VariableDeclaration &&
      node.declarations &&
      node.declarations[0] &&
      node.declarations[0].type === BabelNodeType.VariableDeclarator &&
      node.declarations[0].init &&
      node.declarations[0].init.type === BabelNodeType.AwaitExpression &&
      node.declarations[0].init.argument &&
      node.declarations[0].init.argument.type === BabelNodeType.CallExpression &&
      node.declarations[0].init.argument.callee &&
      node.declarations[0].init.argument.callee.type === BabelNodeType.Import &&
      node.declarations[0].init.argument.arguments &&
      node.declarations[0].init.argument.arguments[0] &&
      node.declarations[0].init.argument.arguments[0].type === BabelNodeType.StringLiteral
    ) {
      const relativePath = node.declarations[0].init.argument.arguments[0].extra.rawValue
      const { start } = node.declarations[0].init.argument.arguments[0]
      const { end } = node.declarations[0].init.argument.arguments[0]
      // @ts-ignore
      dependencies.push({ code, end, relativePath, start })
    }
  }

  const visitor = (node) => {
    if (
      node &&
      node.type === BabelNodeType.CallExpression &&
      node.callee &&
      node.callee.type === BabelNodeType.Import &&
      node.arguments &&
      node.arguments[0] &&
      node.arguments[0].type === BabelNodeType.StringLiteral
    ) {
      const relativePath = node.arguments[0].extra.rawValue
      const { start } = node.arguments[0]
      const { end } = node.arguments[0]
      // @ts-ignore
      dependencies.push({ code, end, relativePath, start })
    }
  }
  Walk.walk(ast, visitor)
  return dependencies
}
