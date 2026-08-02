import { createRequire } from 'node:module'
import { execa } from 'execa'
import { root } from './root.ts'

const serverRequire = createRequire(new URL('../../server/package.json', import.meta.url))
const serverPath = serverRequire.resolve('@lvce-editor/server/bin/server.js')

const main = async () => {
  execa(`npm`, ['run', 'build:watch'], {
    cwd: root,
    stdio: 'inherit',
  })
  execa('node', [serverPath, '--test-path=packages/e2e'], {
    cwd: root,
    stdio: 'inherit',
  })
}

main()
