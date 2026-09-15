import { activate, registerFileSystemProvider } from '@lvce-editor/api'

await activate()
let content = 'before save'
registerFileSystemProvider({
  id: 'save-test',
  isReadonly() {
    return false
  },
  readDirWithFileTypes() {
    return [{ name: 'note.txt', type: 7 }]
  },
  readFile() {
    return content
  },
  writeFile(_uri, value) {
    content = value
  },
})
