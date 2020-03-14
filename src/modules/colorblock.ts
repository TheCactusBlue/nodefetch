import colors from 'colors/safe'

export const colorblock = [
  colors.bgBlack,
  colors.bgRed,
  colors.bgGreen,
  colors.bgYellow,
  colors.bgBlue,
  colors.bgMagenta,
  colors.bgCyan,
  colors.bgWhite,
].map(x => x('   ')).join('')