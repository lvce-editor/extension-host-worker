import * as MimeType from '../MimeType/MimeType.ts'

export const getMimeType = (fileExtension: string): string => {
  switch (fileExtension) {
    case '.css':
      return MimeType.TextCss
    case '.html':
      return MimeType.TextHtml
    case '.js':
    case '.mjs':
    case '.ts':
      return MimeType.TextJavaScript
    case '.json':
    case '.map':
      return MimeType.ApplicationJson
    case '.mp3':
      return MimeType.AudioMpeg
    case '.png':
      return MimeType.ImagePng
    case '.svg':
      return MimeType.ImageSvgXml
    case '.ttf':
      return MimeType.FontTtf
    case '.txt':
      return MimeType.TextPlain
    case '.webm':
      return MimeType.VideoWebm
    default:
      return ''
  }
}
