import { deepStrictEqual, rejects, strictEqual, throws } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  executeSignatureHelpProvider,
  getSignatureHelpProviderRegistrySnapshot,
  registerSignatureHelpProvider,
  resetSignatureHelpProviderRegistry,
} from '../../../src/parts/SignatureHelpProviderRegistry/SignatureHelpProviderRegistry.ts'

const textDocument = {
  languageId: 'sample',
  text: 'fn(',
  uri: '/sample.ts',
}

const signatureHelp = {
  activeParameter: 0,
  activeSignature: 0,
  signatures: [
    {
      label: 'fn(value: string): void',
      parameters: [
        {
          label: 'value: string',
        },
      ],
    },
  ],
}

afterEach(() => {
  resetSignatureHelpProviderRegistry()
})

test('executeSignatureHelpProvider returns signature help from matching provider', async () => {
  registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    provideSignatureHelp(document, offset) {
      strictEqual(document, textDocument)
      strictEqual(offset, 3)
      return signatureHelp
    },
  })

  const result = await executeSignatureHelpProvider(textDocument, 3)

  deepStrictEqual(result, signatureHelp)
})

test('executeSignatureHelpProvider allows undefined result', async () => {
  registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    provideSignatureHelp() {
      return undefined
    },
  })

  strictEqual(await executeSignatureHelpProvider(textDocument, 3), undefined)
})

test('registerSignatureHelpProvider disposes provider', () => {
  const disposable = registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    provideSignatureHelp() {
      return undefined
    },
  })

  strictEqual(getSignatureHelpProviderRegistrySnapshot().providers.length, 1)
  disposable.dispose()
  strictEqual(getSignatureHelpProviderRegistrySnapshot().providers.length, 0)
})

test('registerSignatureHelpProvider rejects duplicate id', () => {
  registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    provideSignatureHelp() {
      return undefined
    },
  })

  throws(() => {
    registerSignatureHelpProvider({
      id: 'sample.signature-help',
      languageId: 'sample',
      provideSignatureHelp() {
        return undefined
      },
    })
  }, /signature help provider sample\.signature-help is already registered/)
})

test('registerSignatureHelpProvider rejects missing language id', () => {
  throws(() => {
    registerSignatureHelpProvider({
      id: 'sample.signature-help',
      // @ts-expect-error testing invalid provider shape
      languageId: undefined,
      provideSignatureHelp() {
        return undefined
      },
    })
  }, /signature help provider sample\.signature-help is missing languageId/)
})

test('registerSignatureHelpProvider rejects missing provideSignatureHelp function', () => {
  throws(() => {
    registerSignatureHelpProvider({
      id: 'sample.signature-help',
      languageId: 'sample',
      // @ts-expect-error testing invalid provider shape
      provideSignatureHelp: undefined,
    })
  }, /signature help provider sample\.signature-help is missing provideSignatureHelp function/)
})

test('executeSignatureHelpProvider rejects missing provider', async () => {
  await rejects(() => executeSignatureHelpProvider(textDocument, 0), /No signature help provider found for sample/)
})

test('executeSignatureHelpProvider rejects primitive result', async () => {
  registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    // @ts-expect-error testing invalid provider result
    provideSignatureHelp() {
      return 123
    },
  })

  await rejects(
    () => executeSignatureHelpProvider(textDocument, 0),
    /invalid signature help result: signature help must be of type object or undefined but is number/,
  )
})

test('executeSignatureHelpProvider rejects array result', async () => {
  registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    // @ts-expect-error testing invalid provider result
    provideSignatureHelp() {
      return []
    },
  })

  await rejects(
    () => executeSignatureHelpProvider(textDocument, 0),
    /invalid signature help result: signature help must be of type object or undefined but is array/,
  )
})

test('executeSignatureHelpProvider propagates provider errors', async () => {
  registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    provideSignatureHelp() {
      throw new Error('sample signature help failed')
    },
  })

  await rejects(() => executeSignatureHelpProvider(textDocument, 0), /sample signature help failed/)
})

test('getSignatureHelpProviderRegistrySnapshot returns registered providers', () => {
  registerSignatureHelpProvider({
    id: 'sample.signature-help',
    languageId: 'sample',
    provideSignatureHelp() {
      return undefined
    },
  })

  deepStrictEqual(
    getSignatureHelpProviderRegistrySnapshot().providers.map((provider) => provider.id),
    ['sample.signature-help'],
  )
})
