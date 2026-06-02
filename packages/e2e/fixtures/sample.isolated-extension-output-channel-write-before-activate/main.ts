import { activate } from '@lvce-editor/api'
import * as api from '@lvce-editor/api'

const { createOutputChannel } = api as any

const output = createOutputChannel('sample.output.beforeActivate')

const main = async (): Promise<void> => {
  await output.append('should throw')
  await activate()
}

main()
