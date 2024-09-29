import { expect, test } from '@jest/globals'
import * as EditorStrings from '../src/parts/EditorStrings/EditorStrings.ts'

test('goToDefinition', () => {
  expect(EditorStrings.goToDefinition()).toBe('Go to Definition')
})

test('noDefinitionFound', () => {
  expect(EditorStrings.noDefinitionFound()).toBe('No definition found')
})

test('noDefinitionFoundFor', () => {
  const word = 'test'
  expect(EditorStrings.noDefinitionFoundFor(word)).toBe("No definition found for 'test'")
})

test('noTypeDefinitionFound', () => {
  expect(EditorStrings.noTypeDefinitionFound()).toBe('No type definition found')
})

test('noTypeDefinitionFoundFor', () => {
  const word = 'test'
  expect(EditorStrings.noTypeDefinitionFoundFor(word)).toBe("No type definition found for 'test'")
})

test('noResults', () => {
  expect(EditorStrings.noResults()).toBe('No Results')
})
