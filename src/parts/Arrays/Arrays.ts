// based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/common/arrays.ts#L625 (License MIT)

const insertInto = <T>(array: T[], start: number, newItems: readonly T[]): void => {
  const originalLength = array.length
  const newItemsLength = newItems.length
  array.length = originalLength + newItemsLength
  // Move the items after the start index, start from the end so that we don't overwrite any value.
  for (let i = originalLength - 1; i >= start; i--) {
    array[i + newItemsLength] = array[i]
  }

  for (let i = 0; i < newItemsLength; i++) {
    array[i + start] = newItems[i]
  }
}

export const push = <T>(array: T[], newItems: readonly T[]): void => {
  insertInto(array, array.length, newItems)
}

export const fromAsync = async (asyncIterable: any): Promise<any[]> => {
  const children: any[] = []
  for await (const value of asyncIterable) {
    children.push(value)
  }
  return children
}
