// @flow

import createTranslate from './create-translate'
import * as utils from '../utils'

const styleSheet = {
  bold: { fontWeight: 'bold' },
}

const renderTranslated = utils.createRenderer({
  styleSheet,
  TextComponent: 'span',
})

export default createTranslate({
  renderer: 'dom',
  renderTranslated,
})
