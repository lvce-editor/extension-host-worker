import { expect, test } from '@jest/globals'
import * as GetJsonSchemasFromExtension from '../src/parts/GetJsonSchemasFromExtension/GetJsonSchemasFromExtension.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'

test('returns no schemas for missing extension metadata', () => {
  expect(GetJsonSchemasFromExtension.getJsonSchemasFromExtension(undefined, PlatformType.Web)).toEqual([])
  expect(GetJsonSchemasFromExtension.getJsonSchemasFromExtension({}, PlatformType.Web)).toEqual([])
})

test('returns no schemas for invalid contributions', () => {
  const extension = {
    path: '/extensions/sample',
    jsonValidation: [undefined, {}, { fileMatch: 'package.json' }, { url: './schema.json' }],
  }
  expect(GetJsonSchemasFromExtension.getJsonSchemasFromExtension(extension, PlatformType.Web)).toEqual([])
})

test('resolves a relative schema url against the extension path', () => {
  const extension = {
    path: '/extensions/prettier',
    jsonValidation: [{ fileMatch: 'package.json', url: './schemas/package.schema.json' }],
  }
  expect(GetJsonSchemasFromExtension.getJsonSchemasFromExtension(extension, PlatformType.Web)).toEqual([
    {
      fileMatch: 'package.json',
      url: '/extensions/prettier/schemas/package.schema.json',
    },
  ])
})

test('preserves remote schema urls and file match arrays', () => {
  const extension = {
    path: '/extensions/prettier',
    jsonValidation: [{ fileMatch: ['.prettierrc', '.prettierrc.json'], url: 'https://json.schemastore.org/prettierrc' }],
  }
  expect(GetJsonSchemasFromExtension.getJsonSchemasFromExtension(extension, PlatformType.Web)).toEqual([
    {
      fileMatch: ['.prettierrc', '.prettierrc.json'],
      url: 'https://json.schemastore.org/prettierrc',
    },
  ])
})

test('uses the remote resource prefix outside the web platform', () => {
  const extension = {
    path: '/home/user/.lvce/extensions/prettier',
    jsonValidation: [{ fileMatch: 'package.json', url: 'schemas/package.schema.json' }],
  }
  expect(GetJsonSchemasFromExtension.getJsonSchemasFromExtension(extension, PlatformType.Remote)).toEqual([
    {
      fileMatch: 'package.json',
      url: '/remote/home/user/.lvce/extensions/prettier/schemas/package.schema.json',
    },
  ])
})
