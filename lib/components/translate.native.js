// @flow

import ReactNative from 'react-native'
import createTranslate from './create-translate'
import * as utils from '../utils'

const styleSheet = ReactNative.StyleSheet.create({
  bold: { fontWeight: 'bold' },
})

const renderTranslated = utils.createRenderer({
  styleSheet,
  TextComponent: ReactNative.Text,
})

export default createTranslate({
  renderer: 'native',
  renderTranslated,
})
