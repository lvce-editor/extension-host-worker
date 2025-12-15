import { createLazyRpc, RpcId } from '@lvce-editor/rpc-registry'

// @ts-ignore

export const { invoke, invokeAndTransfer, setFactory } = createLazyRpc(RpcId.ExtensionManagementWorker)
