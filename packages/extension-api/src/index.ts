export { activate } from './parts/Activation/Activation.ts'
export { registerCommand } from './parts/Command/Command.ts'
export {
  getStatusBarItemProviderRegistrySnapshot,
  registerStatusBarItemProvider,
  resetStatusBarItemProviderRegistry,
} from './parts/StatusBar/StatusBar.ts'
export { handleExtensionManagementMessagePort } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export type { Command, CommandCallback, CommandRegistrySnapshot } from './parts/Command/Command.ts'
export type { Disposable } from './parts/Disposable/Disposable.ts'
export type { HandleExtensionManagementMessagePortOptions } from './parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
export type {
  StatusBarItem,
  StatusBarItemProvider,
  StatusBarItemProviderHandle,
  StatusBarItemProviderRegistrySnapshot,
} from './parts/StatusBar/StatusBar.ts'
