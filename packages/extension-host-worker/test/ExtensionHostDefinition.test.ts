import { beforeEach, expect, test } from '@jest/globals'
import * as ExtensionHostDefinition from '../src/parts/ExtensionHostDefinition/ExtensionHostDefinition.ts'
import * as TextDocument from '../src/parts/ExtensionHostTextDocument/ExtensionHostTextDocument.ts'

beforeEach(() => {
  ExtensionHostDefinition.reset()
})

test('executeDefinitionProvider', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        endOffset: 22,
        startOffset: 15,
        uri: '/test/index.ts',
      }
    },
  })
  // @ts-ignore
  expect(await ExtensionHostDefinition.executeDefinitionProvider(1, 0)).toEqual({
    endOffset: 22,
    startOffset: 15,
    uri: '/test/index.ts',
  })
})

test('executeDefinitionProvider - definition.startOffset is zero', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        endOffset: 0,
        startOffset: 0,
        uri: '/test/index.ts',
      }
    },
  })
  // @ts-ignore
  expect(await ExtensionHostDefinition.executeDefinitionProvider(1, 0)).toEqual({
    endOffset: 0,
    startOffset: 0,
    uri: '/test/index.ts',
  })
})

test('executeDefinitionProvider - error - definition must be of type object but is array', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return []
    },
  })
  // @ts-ignore
  await expect(ExtensionHostDefinition.executeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute definition provider: invalid definition result: definition must be of type object but is []'),
  )
})

test('executeDefinitionProvider - error - definition must be of type object but is function', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return () => {}
    },
  })
  // @ts-ignore
  await expect(ExtensionHostDefinition.executeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute definition provider: invalid definition result: definition must be of type object but is () => { }'),
  )
})

test('executeDefinitionProvider - error - definition.uri must be of type string', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {}
    },
  })
  // @ts-ignore
  await expect(ExtensionHostDefinition.executeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute definition provider: invalid definition result: definition.endOffset must be of type number'),
  )
})

test('executeDefinitionProvider - error - definition.startOffset must be of type number', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        uri: '/test/index.ts',
      }
    },
  })
  // @ts-ignore
  await expect(ExtensionHostDefinition.executeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute definition provider: invalid definition result: definition.endOffset must be of type number'),
  )
})

test('executeDefinitionProvider - error - definition.endOffset must be of type number', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return {
        startOffset: 1,
        uri: '/test/index.ts',
      }
    },
  })
  // @ts-ignore
  await expect(ExtensionHostDefinition.executeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute definition provider: invalid definition result: definition.endOffset must be of type number'),
  )
})

test('executeDefinitionProvider - error - definition provider throws error', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      throw new TypeError('x is not a function')
    },
  })
  // @ts-ignore
  await expect(ExtensionHostDefinition.executeDefinitionProvider(1, 0)).rejects.toThrow(
    new Error('Failed to execute definition provider: TypeError: x is not a function'),
  )
})

test.skip('executeDefinitionProvider - no definition found', async () => {
  TextDocument.setFiles([
    {
      content: '',
      id: 1,
      languageId: 'javascript',
      path: '/test.index.ts',
    },
  ])
  ExtensionHostDefinition.registerDefinitionProvider({
    languageId: 'javascript',
    provideDefinition() {
      return undefined
    },
  })
  // @ts-ignore
  expect(await ExtensionHostDefinition.executeDefinitionProvider(1, 0)).toBe(undefined)
})
