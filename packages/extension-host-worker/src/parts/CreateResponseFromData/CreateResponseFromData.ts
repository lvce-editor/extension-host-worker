import * as HttpHeader from '../HttpHeader/HttpHeader.ts'

export const createResponseFromData = (data: any): Response => {
  const responseString = JSON.stringify(data, null, 2)
  const response = new Response(responseString, {
    headers: {
      [HttpHeader.ContentType]: 'application/json',
      [HttpHeader.ContentLength]: `${responseString.length}`,
    },
  })
  return response
}