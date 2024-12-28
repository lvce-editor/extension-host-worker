import * as Arrays from '../Arrays/Arrays.ts'
import * as Assert from '../Assert/Assert.ts'

export const getChildHandles = async (handle: FileSystemHandle): Promise<readonly FileSystemHandle[]> => {
  Assert.object(handle)
  // @ts-ignore
  const childHandles = handle.values()
  const handles = await Arrays.fromAsync(childHandles)
  return handles
}
