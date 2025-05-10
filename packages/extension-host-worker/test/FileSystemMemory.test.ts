import { beforeEach, expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FileSystemMemory from '../src/parts/FileSystemMemory/FileSystemMemory.ts'
import * as FileSystemMemoryState from '../src/parts/FileSystemMemoryState/FileSystemMemoryState.ts'

beforeEach(() => {
  FileSystemMemoryState.reset()
})

test('readFile', () => {
  FileSystemMemoryState.setDirent('/test/file.txt', {
    type: DirentType.File,
    content: 'test content',
  })
  expect(FileSystemMemory.readFile('/test/file.txt')).toBe('test content')
})

test('writeFile', () => {
  FileSystemMemory.writeFile('/test/file.txt', 'test content')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/file.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  })
})

test('readDirWithFileTypes - file', () => {
  FileSystemMemoryState.setDirent('/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/test/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/test/file.txt', {
    content: 'test content',
    type: DirentType.File,
  })
  expect(FileSystemMemory.readDirWithFileTypes('/test')).toEqual([
    {
      name: 'file.txt',
      type: DirentType.File,
    },
  ])
})

test('readDirWithFileTypes - directory', () => {
  FileSystemMemoryState.setDirent('/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/test/', {
    type: DirentType.Directory,
    content: '',
  })

  FileSystemMemoryState.setDirent('/test/file.txt', {
    content: 'test content',
    type: DirentType.File,
  })
  expect(FileSystemMemory.readDirWithFileTypes('/')).toEqual([
    {
      name: 'test',
      type: DirentType.Directory,
    },
  ])
})

test('readDirWithFileTypes - mixed content', () => {
  FileSystemMemoryState.setDirent('/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/languages/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/sample-folder/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/test.txt', {
    type: DirentType.File,
    content: 'div',
  })
  FileSystemMemoryState.setDirent('/languages/index.html', {
    type: DirentType.File,
    content: 'div',
  })
  FileSystemMemoryState.setDirent('/sample-folder/a.txt', {
    type: DirentType.File,
    content: '',
  })
  FileSystemMemoryState.setDirent('/sample-folder/b.txt', {
    type: DirentType.File,
    content: '',
  })
  FileSystemMemoryState.setDirent('/sample-folder/c.txt', {
    type: DirentType.File,
    content: '',
  })
  expect(FileSystemMemory.readDirWithFileTypes('/')).toEqual([
    {
      name: 'languages',
      type: DirentType.Directory,
    },
    {
      name: 'sample-folder',
      type: DirentType.Directory,
    },
    {
      name: 'test.txt',
      type: DirentType.File,
    },
  ])
})

test('getPathSeparator', () => {
  expect(FileSystemMemory.getPathSeparator()).toBe('/')
})

test('rename - file', () => {
  FileSystemMemoryState.setDirent('/test/file.txt', {
    type: DirentType.File,
    content: 'test content',
  })
  FileSystemMemory.rename('/test/file.txt', '/test/renamed.txt')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/renamed.txt': {
      type: DirentType.File,
      content: 'test content',
    },
  })
})

test('rename - directory', () => {
  FileSystemMemoryState.setDirent('/test/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/test/file.txt', {
    type: DirentType.File,
    content: 'test content',
  })
  FileSystemMemory.rename('/test/', '/renamed/')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/renamed/': {
      type: DirentType.Directory,
      content: '',
    },
    '/renamed/file.txt': {
      type: DirentType.File,
      content: 'test content',
    },
  })
})

test('rename - nested directory', () => {
  FileSystemMemoryState.setDirent('/test/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/test/nested/', {
    type: DirentType.Directory,
    content: '',
  })
  FileSystemMemoryState.setDirent('/test/nested/file.txt', {
    type: DirentType.File,
    content: 'test content',
  })
  FileSystemMemory.rename('/test/nested/', '/test/renamed/')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/renamed/': {
      type: DirentType.Directory,
      content: '',
    },
    '/test/renamed/file.txt': {
      type: DirentType.File,
      content: 'test content',
    },
  })
})
