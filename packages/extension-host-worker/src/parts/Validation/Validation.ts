import * as GetType from '../GetType/GetType.ts'

const validateResultObject = (result, resultShape): string | undefined => {
  if (!resultShape.properties) {
    return undefined
  }
  for (const [key, value] of Object.entries(resultShape.properties)) {
    // @ts-ignore
    const expectedType = value.type
    const actualType = GetType.getType(result[key])
    if (expectedType !== actualType) {
      return `item.${key} must be of type ${expectedType}`
    }
  }
  return undefined
}

const validateResultArray = (result, resultShape): string | undefined => {
  for (const item of result) {
    const actualType = GetType.getType(item)
    const expectedType = resultShape.items.type
    if (actualType !== expectedType) {
      return `expected result to be of type ${expectedType} but was of type ${actualType}`
    }
  }
  return undefined
}

const getPreviewObject = (item): string => {
  return 'object'
}

const getPreviewArray = (item): string => {
  if (item.length === 0) {
    return '[]'
  }
  return 'array'
}

const getPreviewString = (item): string => {
  return `"${item}"`
}

const getPreview = (item): string => {
  const type = GetType.getType(item)
  switch (type) {
    case 'array':
      return getPreviewArray(item)
    case 'object':
      return getPreviewObject(item)
    case 'string':
      return getPreviewString(item)
    default:
      return `${item}`
  }
}

export const validate = (item, schema): string | undefined => {
  if (typeof schema === 'function') {
    return schema(item)
  }
  const actualType = GetType.getType(item)
  const expectedType = schema.type
  if (actualType !== expectedType) {
    if (schema.allowUndefined && (item === undefined || item === null)) {
      return item
    }
    const preview = getPreview(item)
    return `item must be of type ${expectedType} but is ${preview}`
  }
  switch (actualType) {
    case 'array':
      return validateResultArray(item, schema)
    case 'object':
      return validateResultObject(item, schema)
  }
  // TODO use json schema to validate result
  return undefined
}
