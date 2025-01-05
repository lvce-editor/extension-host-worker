const getExtensionColorThemeNames = (extension) => {
  return extension.colorThemes || []
}

const getColorThemeId = (colorTheme) => {
  return colorTheme.id
}

// TODO should send names to renderer worker or names with ids?
export const getColorThemeNamesFromExtensions = async (extensions) => {
  const colorThemes = extensions.flatMap(getExtensionColorThemeNames)
  const colorThemeNames = colorThemes.map(getColorThemeId)
  return colorThemeNames
}
