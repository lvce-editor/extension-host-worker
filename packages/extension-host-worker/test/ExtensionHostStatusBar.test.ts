import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => {
  return {
    invoke: jest.fn(),
  }
})

const ExtensionHostStatusBar = await import('../src/parts/ExtensionHostStatusBar/ExtensionHostStatusBar.ts')
const Rpc = await import('../src/parts/Rpc/Rpc.ts')

let errorSpy

beforeEach(() => {
  jest.resetAllMocks()
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  ExtensionHostStatusBar.reset()
})

afterEach(() => {
  errorSpy.mockRestore()
})

test('registerStatusBarItemProvider - returns handle with refresh method', async () => {
  const provider = {
    getStatusBarItem() {
      return {
        text: '1',
      }
    },
    id: 'xyz',
  }

  const handle = ExtensionHostStatusBar.registerStatuBarItemProvider(provider)

  expect(handle).toEqual({
    refresh: expect.any(Function),
  })

  await handle.refresh()

  expect(Rpc.invoke).toHaveBeenCalledWith('StatusBar.handleChange', 'xyz')
})

test('registerStatusBarItemProvider - duplicate id', () => {
  const provider = {
    getStatusBarItem() {
      return {
        text: '1',
      }
    },
    id: 'xyz',
  }

  ExtensionHostStatusBar.registerStatuBarItemProvider(provider)

  expect(() => {
    ExtensionHostStatusBar.registerStatuBarItemProvider(provider)
  }).toThrow(new Error('Failed to register status bar item provider xyz: status bar item provider cannot be registered multiple times'))
})

test('executeStatusBarItemProvider - returns latest item', () => {
  let count = 0
  const provider = {
    getStatusBarItem() {
      count++
      return {
        text: String(count),
      }
    },
    id: 'xyz',
  }

  ExtensionHostStatusBar.registerStatuBarItemProvider(provider)

  expect(ExtensionHostStatusBar.executeStatusBarItemProvider('xyz')).toEqual({ text: '1' })
  expect(ExtensionHostStatusBar.executeStatusBarItemProvider('xyz')).toEqual({ text: '2' })
})

test('executeStatusBarItemProvider - returns error item for invalid text', () => {
  const provider = {
    getStatusBarItem() {
      return {
        name: 'xyz',
        text: 1,
      }
    },
    id: 'xyz',
  }

  ExtensionHostStatusBar.registerStatuBarItemProvider(provider)

  expect(ExtensionHostStatusBar.executeStatusBarItemProvider('xyz')).toEqual({
    icon: '',
    name: 'error',
    onClick: '',
    text: 'error',
    title: 'Failed to execute status bar item provider xyz: status bar item.text must be a string, got number',
  })
  expect(errorSpy).toHaveBeenCalledWith(expect.any(Error))
})

test('executeStatusBarItemProvider - returns error item for invalid name', () => {
  const provider = {
    getStatusBarItem() {
      return {
        name: 1,
        text: 'passed',
      }
    },
    id: 'xyz',
  }

  ExtensionHostStatusBar.registerStatuBarItemProvider(provider)

  expect(ExtensionHostStatusBar.executeStatusBarItemProvider('xyz')).toEqual({
    icon: '',
    name: 'error',
    onClick: '',
    text: 'error',
    title: 'Failed to execute status bar item provider xyz: status bar item.name must be a string, got number',
  })
  expect(errorSpy).toHaveBeenCalledWith(expect.any(Error))
})

test('getStatusBarItems2 - returns error item for invalid provider data', async () => {
  const provider = {
    getStatusBarItem() {
      return {
        name: 'xyz',
        text: 1,
      }
    },
    id: 'xyz',
  }

  ExtensionHostStatusBar.registerStatuBarItemProvider(provider)

  await expect(ExtensionHostStatusBar.getStatusBarItems2()).resolves.toEqual([
    {
      icon: '',
      name: 'error',
      onClick: '',
      text: 'error',
      title: 'Failed to execute status bar item provider xyz: status bar item.text must be a string, got number',
    },
  ])
  expect(errorSpy).toHaveBeenCalledWith(expect.any(Error))
})
