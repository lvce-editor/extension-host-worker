import { activate } from '@lvce-editor/api'
import * as api from '@lvce-editor/api'

const { createOutputChannel } = api as any

createOutputChannel('sample.output.missingContribution')

const main = async (): Promise<void> => {
  await activate()
}

main()
