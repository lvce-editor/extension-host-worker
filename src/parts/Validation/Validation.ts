const getType = (value): string => {
  switch (typeof value) {
    case 'number':
      return 'number'
    case 'function':
      return 'function'
    case 'string':
      return 'string'
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (Array.isArray(value)) {
        return 'array'
      }
      return 'object'
    case 'boolean':
      return 'boolean'
    case 'undefined':
      return 'undefined'
    default:
      return 'unknown'
  }
}

const validateResultObject = (result, resultShape): string | undefined => {
  if (!resultShape.properties) {
    return undefined
  }
  for (const [key, value] of Object.entries(resultShape.properties)) {
    // @ts-ignore
    const expectedType = value.type
    const actualType = getType(result[key])
    if (expectedType !== actualType) {
      return `item.${key} must be of type ${expectedType}`
    }
  }
  return undefined
}

const validateResultArray = (result, resultShape): string | undefined => {
  for (const item of result) {
    const actualType = getType(item)
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
  const type = getType(item)
  switch (type) {
    case 'object':
      return getPreviewObject(item)
    case 'array':
      return getPreviewArray(item)
    case 'string':
      return getPreviewString(item)
    default:
      return `${item}`
  }
}

export const validate = (item, schema): string | undefined => {
  const actualType = getType(item)
  const expectedType = schema.type
  if (actualType !== expectedType) {
    if (schema.allowUndefined && (item === undefined || item === null)) {
      return item
    }
    const preview = getPreview(item)
    return `item must be of type ${expectedType} but is ${preview}`
  }
  switch (actualType) {
    case 'object':
      return validateResultObject(item, schema)
    case 'array':
      return validateResultArray(item, schema)
  }
  // TODO use json schema to validate result
  return undefined
}
