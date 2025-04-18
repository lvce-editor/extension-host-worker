import * as Character from '../Character/Character.ts'
import * as Logger from '../Logger/Logger.ts'

// @ts-ignore
const rgba = (r, g, b, a) => {
  r = Math.min(255, Math.max(0, r)) | 0
  g = Math.min(255, Math.max(0, g)) | 0
  b = Math.min(255, Math.max(0, b)) | 0
  return {
    r,
    g,
    b,
    a,
  }
}

// @ts-ignore
const darken = () => {}

// @ts-ignore
const lighten = () => {}

const transparent = (color, factor) => {
  return color
}

// @ts-ignore
const isValidHexColor = (value) => {
  return true
}

const toColorRule = ([key, value]) => {
  return `  --${key}: ${value};`
}

const toTokenColorRule = (tokenColor) => {
  return `.${tokenColor.name} { color: ${tokenColor.foreground} }`
}

const addFallbackColors = (colors) => {
  const newColors = { ...colors }
  if (!newColors.ActivityBarInactiveForeground) {
    // TODO don't assign, avoid mutation
    newColors.ActivityBarInactiveForeground = transparent(newColors.ActivityBarForeground, 0.4)
  }
  newColors.CssVariableName ||= colors.VariableName
  return newColors
}

export const createColorThemeFromJson = (colorThemeId, colorThemeJson) => {
  if (!colorThemeJson) {
    Logger.warn(`color theme json for "${colorThemeId}" is empty: "${colorThemeJson}"`)
    return ''
  }
  if (typeof colorThemeJson !== 'object') {
    Logger.warn(`color theme json for "${colorThemeId}" cannot be converted to css: "${colorThemeJson}"`)
    return ''
  }
  if (Array.isArray(colorThemeJson)) {
    Logger.warn(`color theme json for "${colorThemeId}" cannot be converted to css, it must be of type object but was of type array`)
    return ''
  }
  const { colors } = colorThemeJson
  if (!colors) {
    return ''
  }
  const newColors = addFallbackColors(colors)
  const colorRules = Object.entries(newColors).map(toColorRule)
  const tokenColors = colorThemeJson.tokenColors || []
  const tokenColorRules = tokenColors.map(toTokenColorRule)
  const extraRules: string[] = []
  if (colors.ContrastBorder) {
    extraRules.push(
      `#ActivityBar, #SideBar {
  border-left: 1px solid var(--ContrastBorder);
}`,
      `#Panel {
  border-top: 1px solid var(--ContrastBorder);
}`,
      `#StatusBar {
  border-top: 1px solid var(--ContrastBorder);
}`,
      `.ActivityBarItemBadge {
  border: 1px solid var(--ContrastBorder);
}`,
      `#QuickPick {
  border: 1px solid var(--ContrastBorder);
}`,
    )
  }
  const colorThemeCss = `:root {\n${colorRules.join(Character.NewLine)}\n}\n\n${tokenColorRules.join(Character.NewLine)}\n\n${extraRules.join(
    Character.NewLine,
  )}`
  return colorThemeCss
}

// for (let i = 0; i < 10000; i++) {
//   createColorThemeFromJson({
//     type: 'dark',
//     colors: {
//       ActivityBarBackground: 'rgb(40, 46, 47)',
//       ActivityBarForeground: '#878f8c',
//       ActivityBarActiveBackground: '#1f2727',

//       EditorBackGround: '#1e2324',
//       EditorScrollBarBackground: 'rgba(57, 71, 71, 0.6)',
//       EditorCursorBackground: '#a8df5a',

//       ListActiveSelectionBackground: '#515f59',
//       ListActiveSelectionForeground: '#ffffff',
//       ListHoverBackground: '#405c5033',
//       ListHoverForeground: '#e0e0e0',
//       ListInactiveSelectionBackground: '#3b474280',

//       MainBackground: '#1e2324',

//       PanelBackground: '#1b2020',
//       PanelBorderTopColor: 'rgba(128, 128, 128, 0.35)',

//       SideBarBackground: '#1b2020',

//       StatusBarBackground: 'rgb(40, 46, 47)',
//       StatusBarBorderTopColor: '#222222',

//       TabActiveBackground: '#24292a',
//       TabInactiveBackground: '#282e2f',

//       TitleBarBackground: 'rgb(40, 46, 47)',
//       TitleBarBorderBottomColor: '#222',
//       TitleBarColor: '#cccccc',
//       TitleBarColorInactive: 'rgba(204, 204, 204, 0.6)',
//     },
//   }) //?.
// }
