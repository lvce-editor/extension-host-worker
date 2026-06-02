import { activate, createOutputChannel } from '@lvce-editor/api'

const output = createOutputChannel('sample.output.beforeActivate')

const main = async (): Promise<void> => {
  await output.append('should throw')
  await activate()
}

main()
