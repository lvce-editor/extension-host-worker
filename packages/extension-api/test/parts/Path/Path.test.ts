import { strictEqual, throws } from 'node:assert/strict'
import { test } from 'node:test'
import { path } from '../../../src/parts/Path/Path.ts'

test('joins a path to a URI with or without a trailing slash', () => {
  strictEqual(path.join('file:///workspace', 'greeting.txt'), 'file:///workspace/greeting.txt')
  strictEqual(path.join('file:///workspace/', 'greeting.txt'), 'file:///workspace/greeting.txt')
  strictEqual(path.join('file:///', 'greeting.txt'), 'file:///greeting.txt')
  strictEqual(path.join('memfs://workspace', 'greeting.txt'), 'memfs://workspace/greeting.txt')
})

test('preserves URI schemes, authorities, query strings and encoded path content', () => {
  strictEqual(
    path.join('vscode-remote://ssh-remote+host/home/user/workspace/?view=1#editor', 'my%20file%2Fname.txt'),
    'vscode-remote://ssh-remote+host/home/user/workspace/my%20file%2Fname.txt?view=1#editor',
  )
})

test('normalizes dot segments and treats absolute segments as relative to the URI', () => {
  strictEqual(path.join('memfs://workspace/a', '/b', '.', 'c', '..', 'greeting.txt'), 'memfs://workspace/a/b/greeting.txt')
  strictEqual(path.join('file:///workspace', '..', '..', 'greeting.txt'), 'file:///greeting.txt')
})

test('rejects values without an absolute URI scheme', () => {
  throws(() => path.join('/workspace', 'greeting.txt'), { name: 'TypeError' })
})
