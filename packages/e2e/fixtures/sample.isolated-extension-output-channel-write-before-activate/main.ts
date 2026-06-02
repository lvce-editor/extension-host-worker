import { activate, createOutputChannel } from '@lvce-editor/api'

const output = createOutputChannel('sample-output-before-activate')

const main = async (): Promise<void> => {
  await output.append('should throw')
  await activate()
}

main()
