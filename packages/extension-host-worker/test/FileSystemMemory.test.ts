import { beforeEach, expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FileSystemMemory from '../src/parts/FileSystemMemory/FileSystemMemory.ts'
import * as FileSystemMemoryState from '../src/parts/FileSystemMemoryState/FileSystemMemoryState.ts'

beforeEach(() => {
  FileSystemMemoryState.reset()
})

test('readFile', () => {
  FileSystemMemoryState.setDirent('/test/file.txt', {
    content: 'test content',
    type: DirentType.File,
  })
  expect(FileSystemMemory.readFile('/test/file.txt')).toBe('test content')
})

test('writeFile', () => {
  FileSystemMemory.writeFile('/test/file.txt', 'test content')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      content: '',
      type: DirentType.Directory,
    },
    '/test/': {
      content: '',
      type: DirentType.Directory,
    },
    '/test/file.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  })
})

test('readDirWithFileTypes - file', () => {
  FileSystemMemoryState.setDirent('/', {
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/test/', {
    content: '',
    type: DirentType.Directory,
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
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/test/', {
    content: '',
    type: DirentType.Directory,
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
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/languages/', {
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/sample-folder/', {
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/test.txt', {
    content: 'div',
    type: DirentType.File,
  })
  FileSystemMemoryState.setDirent('/languages/index.html', {
    content: 'div',
    type: DirentType.File,
  })
  FileSystemMemoryState.setDirent('/sample-folder/a.txt', {
    content: '',
    type: DirentType.File,
  })
  FileSystemMemoryState.setDirent('/sample-folder/b.txt', {
    content: '',
    type: DirentType.File,
  })
  FileSystemMemoryState.setDirent('/sample-folder/c.txt', {
    content: '',
    type: DirentType.File,
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
    content: 'test content',
    type: DirentType.File,
  })
  FileSystemMemory.rename('/test/file.txt', '/test/renamed.txt')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      content: '',
      type: DirentType.Directory,
    },
    '/test/': {
      content: '',
      type: DirentType.Directory,
    },
    '/test/renamed.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  })
})

test('rename - directory', () => {
  FileSystemMemoryState.setDirent('/test/', {
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/test/file.txt', {
    content: 'test content',
    type: DirentType.File,
  })
  FileSystemMemory.rename('/test/', '/renamed/')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      content: '',
      type: DirentType.Directory,
    },
    '/renamed/': {
      content: '',
      type: DirentType.Directory,
    },
    '/renamed/file.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  })
})

test('rename - nested directory', () => {
  FileSystemMemoryState.setDirent('/test/', {
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/test/nested/', {
    content: '',
    type: DirentType.Directory,
  })
  FileSystemMemoryState.setDirent('/test/nested/file.txt', {
    content: 'test content',
    type: DirentType.File,
  })
  FileSystemMemory.rename('/test/nested/', '/test/renamed/')
  expect(FileSystemMemoryState.getAll()).toEqual({
    '/': {
      content: '',
      type: DirentType.Directory,
    },
    '/test/': {
      content: '',
      type: DirentType.Directory,
    },
    '/test/renamed/': {
      content: '',
      type: DirentType.Directory,
    },
    '/test/renamed/file.txt': {
      content: 'test content',
      type: DirentType.File,
    },
  })
})
