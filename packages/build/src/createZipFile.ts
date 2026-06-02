import { ZipFile } from 'yazl'

export const createZipFile = async (fileName: string, content: Buffer): Promise<Buffer> => {
  const zipFile = new ZipFile()
  const chunks: Buffer[] = []
  const zipFilePromise = new Promise<Buffer>((resolve, reject) => {
    zipFile.outputStream.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    zipFile.outputStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    zipFile.outputStream.on('error', reject)
  })
  zipFile.addBuffer(content, fileName, {
    compress: true,
    compressionLevel: 9,
  })
  zipFile.end()
  return zipFilePromise
}
