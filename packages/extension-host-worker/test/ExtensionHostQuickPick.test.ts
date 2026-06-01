import { beforeEach, expect, jest, test } from '@jest/globals'

const quickPickInvoke = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => {
  return {
    QuickPickWorker: {
      invoke: quickPickInvoke,
    },
  }
})

const ExtensionHostQuickPick = await import('../src/parts/ExtensionHostQuickPick/ExtensionHostQuickPick.ts')

test('showQuickPick', async () => {
  quickPickInvoke.mockResolvedValueOnce('branch-2' as never)

  const items = [
    {
      description: 'Local branch',
      label: 'branch 1',
      value: 'branch-1',
    },
    {
      description: 'Remote branch',
      label: 'branch 2',
      value: 'branch-2',
    },
  ]

  const result = await ExtensionHostQuickPick.showQuickPick({
    items,
    placeholder: 'Select branch',
  })

  expect(result).toBe('branch-2')
  expect(quickPickInvoke).toHaveBeenCalledTimes(1)
  expect(quickPickInvoke).toHaveBeenCalledWith('QuickPick.showQuickPick', {
    items,
    placeholder: 'Select branch',
  })
})

test('showQuickPick - canceled', async () => {
  quickPickInvoke.mockResolvedValueOnce(undefined as never)

  const result = await ExtensionHostQuickPick.showQuickPick({
    items: [
      {
        description: 'Local branch',
        label: 'branch 1',
        value: 'branch-1',
      },
    ],
  })

  expect(result).toBeUndefined()
})

test('showQuickPick - missing description', async () => {
  await expect(
    ExtensionHostQuickPick.showQuickPick({
      items: [
        {
          label: 'branch 1',
          value: 'branch-1',
        } as any,
      ],
    }),
  ).rejects.toThrow(new TypeError('quick pick item.description must be a string'))
})

test('showQuickInput - basic usage', async () => {
  const render = jest.fn()
  render.mockResolvedValueOnce([{ label: 'Initial result', value: 'initial-result' }] as never)
  render.mockResolvedValueOnce([{ label: 'Search result', value: 'search-result' }] as never)
  quickPickInvoke.mockImplementationOnce(async (_command: unknown, options: any) => {
    const rendered = await ExtensionHostQuickPick.renderQuickInput(options.id, 'search')
    expect(rendered).toEqual([{ label: 'Search result', value: 'search-result' }])
    return {
      canceled: false,
      inputValue: 'test input',
    }
  })

  const result = await ExtensionHostQuickPick.showQuickInput({
    ignoreFocusOut: false,
    initialValue: 'initial',
    render,
  })

  expect(result).toEqual({
    canceled: false,
    inputValue: 'test input',
  })
  expect(quickPickInvoke).toHaveBeenCalledTimes(1)
  expect(quickPickInvoke).toHaveBeenCalledWith('QuickPick.showQuickInput', {
    id: expect.any(Number),
    ignoreFocusOut: false,
    initialItems: [{ label: 'Initial result', value: 'initial-result' }],
    initialValue: 'initial',
  })
  await expect(ExtensionHostQuickPick.renderQuickInput(1, 'search')).resolves.toEqual([])
})
