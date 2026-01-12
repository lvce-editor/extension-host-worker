import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => {
  return {
    invoke: jest.fn(() => {}),
  }
})

jest.unstable_mockModule('../src/parts/FileSearchWorker/FileSearchWorker.ts', () => {
  return {
    invoke: jest.fn(() => Promise.resolve({ canceled: false, inputValue: '' })),
  }
})

const ExtensionHostQuickPick = await import('../src/parts/ExtensionHostQuickPick/ExtensionHostQuickPick.ts')
const Rpc = await import('../src/parts/Rpc/Rpc.ts')
const FileSearchWorker = await import('../src/parts/FileSearchWorker/FileSearchWorker.ts')

test.skip('showQuickPick', async () => {
  const getPicks = () => {
    return []
  }
  const toPick = (value) => {
    return value
  }
  expect(
    await ExtensionHostQuickPick.showQuickPick({
      getPicks,
      toPick,
    }),
  ).toEqual(undefined)
  expect(Rpc.invoke).toHaveBeenCalledTimes(1)
  expect(Rpc.invoke).toHaveBeenCalledWith('ExtensionHostQuickPick.show', [])
})

test.skip('showQuickInput - basic usage', async () => {
  // @ts-ignore
  FileSearchWorker.invoke.mockResolvedValueOnce({
    canceled: false,
    inputValue: 'test input',
  })

  const render = jest.fn()
  const result = await ExtensionHostQuickPick.showQuickInput({
    ignoreFocusOut: false,
    initialValue: 'initial',
    render,
  })

  expect(result).toEqual({
    canceled: false,
    inputValue: 'test input',
  })
  expect(FileSearchWorker.invoke).toHaveBeenCalledTimes(1)
  expect(FileSearchWorker.invoke).toHaveBeenCalledWith('QuickPick.showQuickInput', {
    ignoreFocusOut: false,
    initialValue: 'initial',
    render,
  })
})

test.skip('showQuickInput - canceled', async () => {
  // @ts-ignore
  FileSearchWorker.invoke.mockResolvedValueOnce({
    canceled: true,
    inputValue: '',
  })

  const render = jest.fn()
  const result = await ExtensionHostQuickPick.showQuickInput({
    ignoreFocusOut: true,
    initialValue: '',
    render,
  })

  expect(result).toEqual({
    canceled: true,
    inputValue: '',
  })
  expect(FileSearchWorker.invoke).toHaveBeenCalledTimes(1)
})

test.skip('showQuickInput - with ignoreFocusOut true', async () => {
  // @ts-ignore
  FileSearchWorker.invoke.mockResolvedValueOnce({
    canceled: false,
    inputValue: 'user input',
  })

  const render = jest.fn()
  await ExtensionHostQuickPick.showQuickInput({
    ignoreFocusOut: true,
    initialValue: 'test',
    render,
  })

  expect(FileSearchWorker.invoke).toHaveBeenCalledWith('QuickPick.showQuickInput', {
    ignoreFocusOut: true,
    initialValue: 'test',
    render,
  })
})

test.skip('showQuickInput - without optional parameters', async () => {
  // @ts-ignore
  FileSearchWorker.invoke.mockResolvedValueOnce({
    canceled: false,
    inputValue: 'result',
  })

  const result = await ExtensionHostQuickPick.showQuickInput({})

  expect(result).toEqual({
    canceled: false,
    inputValue: 'result',
  })
  expect(FileSearchWorker.invoke).toHaveBeenCalledWith('QuickPick.showQuickInput', {})
})

test.skip('showQuickInput - with empty initial value', async () => {
  // @ts-ignore
  FileSearchWorker.invoke.mockResolvedValueOnce({
    canceled: false,
    inputValue: 'typed value',
  })

  const render = jest.fn()
  const result = await ExtensionHostQuickPick.showQuickInput({
    ignoreFocusOut: false,
    initialValue: '',
    render,
  })

  expect(result.inputValue).toBe('typed value')
  expect(FileSearchWorker.invoke).toHaveBeenCalledWith('QuickPick.showQuickInput', {
    ignoreFocusOut: false,
    initialValue: '',
    render,
  })
})

test.skip('showQuickInput - render function is passed correctly', async () => {
  // @ts-ignore
  FileSearchWorker.invoke.mockResolvedValueOnce({
    canceled: false,
    inputValue: 'result',
  })

  const render = jest.fn(async (searchValue) => {
    return [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ]
  })

  await ExtensionHostQuickPick.showQuickInput({
    ignoreFocusOut: false,
    initialValue: 'test',
    render,
  })

  const callArgs = (FileSearchWorker.invoke as jest.Mock).mock.calls[0]
  // @ts-ignoree
  expect(callArgs[1].render).toBe(render)
})
