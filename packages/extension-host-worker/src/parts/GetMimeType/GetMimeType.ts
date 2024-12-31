import * as MimeType from '../MimeType/MimeType.ts'

export const getMimeType = (fileExtension: string): string => {
  switch (fileExtension) {
    case '.html':
      return MimeType.TextHtml
    case '.css':
      return MimeType.TextCss
    case '.ttf':
      return MimeType.FontTtf
    case '.js':
    case '.mjs':
    case '.ts':
      return MimeType.TextJavaScript
    case '.svg':
      return MimeType.ImageSvgXml
    case '.png':
      return MimeType.ImagePng
    case '.json':
    case '.map':
      return MimeType.ApplicationJson
    case '.mp3':
      return MimeType.AudioMpeg
    case '.webm':
      return MimeType.VideoWebm
    case '.txt':
      return MimeType.TextPlain
    default:
      return ''
  }
}
