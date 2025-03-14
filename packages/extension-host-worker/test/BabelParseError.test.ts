import { expect, test } from '@jest/globals'
import { BabelParseError } from '../src/parts/BabelParseError/BabelParseError.ts'

test('name', () => {
  const error = new SyntaxError('Syntax Error')
  // @ts-ignore
  error.loc = { line: 0, column: 0 }
  const babelParseError = new BabelParseError('', error)
  expect(babelParseError.name).toBe('BabelParseError')
})
