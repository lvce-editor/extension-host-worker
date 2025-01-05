export const createResponseFromData = (data: any): Response => {
  const responseString = JSON.stringify(data)
  const response = new Response(responseString, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': `${responseString.length}`,
    },
  })
  return response
}
