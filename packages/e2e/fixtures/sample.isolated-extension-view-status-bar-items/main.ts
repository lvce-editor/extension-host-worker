import { activate as activateExtensionApi, registerView } from '@lvce-editor/api'

export const activate = (): void => {
  activateExtensionApi()
  registerView({
    create() {
      return {
        render() {
          return []
        },
        renderStatusBarItems() {
          return [
            {
              ariaLabel: 'Image dimensions: 640 by 480 pixels',
              name: 'view-dimensions',
              text: '640x480',
              title: 'Image dimensions',
            },
            {
              ariaLabel: 'Image size: 42 kilobytes',
              name: 'view-size',
              text: '42 KB',
              title: 'Image size',
            },
          ]
        },
      }
    },
    id: 'sample.views.statusBarItems',
    kind: 'virtualDom',
    preferredLocation: 'preview',
  })
}
