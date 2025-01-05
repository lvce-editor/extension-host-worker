import { expect, test } from '@jest/globals'
import { createResponseFromData } from '../src/parts/CreateResponseFromData/CreateResponseFromData.ts'

test('createResponseFromData - creates response with simple object', () => {
  const data = { message: 'hello' }
  const response = createResponseFromData(data)

  expect(response).toBeInstanceOf(Response)
  expect(response.headers.get('Content-Type')).toBe('application/json')
  expect(response.headers.get('Content-Length')).toBe('24') // Length of formatted JSON string
})

test('createResponseFromData - creates response with nested object', () => {
  const data = {
    user: {
      name: 'John',
      age: 30,
    },
  }
  const response = createResponseFromData(data)

  expect(response).toBeInstanceOf(Response)
  expect(response.headers.get('Content-Type')).toBe('application/json')
  expect(response.headers.get('Content-Length')).toBe('53')
})

test('createResponseFromData - creates response with array', () => {
  const data = [1, 2, 3]
  const response = createResponseFromData(data)

  expect(response).toBeInstanceOf(Response)
  expect(response.headers.get('Content-Type')).toBe('application/json')
  expect(response.headers.get('Content-Length')).toBe('7')
})

test('createResponseFromData - creates response with null', () => {
  const data = null
  const response = createResponseFromData(data)

  expect(response).toBeInstanceOf(Response)
  expect(response.headers.get('Content-Type')).toBe('application/json')
  expect(response.headers.get('Content-Length')).toBe('4')
})

test('createResponseFromData - response body contains correct JSON', async () => {
  const data = { test: 'value' }
  const response = createResponseFromData(data)

  const responseBody = await response.json()
  expect(responseBody).toEqual(data)
})
