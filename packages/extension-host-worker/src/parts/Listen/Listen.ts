import { launchExtensionManagementWorker } from '../LaunchExtensionManagementWorker/LaunchExtensionManagementWorker.ts'
import { launchFileSearchWorker } from '../LaunchFileSearchWorker/LaunchFileSearchWorker.ts'
import { launchRendererWorker } from '../LaunchRendererWorker/LaunchRendererWorker.ts'

export const listen = async (): Promise<void> => {
  await Promise.all([launchExtensionManagementWorker(), launchFileSearchWorker(), launchRendererWorker()])
}
