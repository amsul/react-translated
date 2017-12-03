// @flow

import * as React from 'react'
import ReactNative from 'react-native'
import createTranslate from './create-translate'
import * as utils from '../utils'

const styleSheet = ReactNative.StyleSheet.create({
  bold: { fontWeight: 'bold' },
  link: { textDecorationLine: 'underline' },
})

const BoldText = ({ children }: { children: React.Node }) => (
  <ReactNative.Text style={styleSheet.bold}>{children}</ReactNative.Text>
)

const Link = ({ onPress, text, url }: { onPress: () => mixed, text: string, url: string }) => (
  <ReactNative.Text
    onPress={() => onPress({ url })}
    style={[styleSheet.bold, styleSheet.link]}
    >
    {text}
  </ReactNative.Text>
)

const renderTranslated = utils.createRenderer({
  Component: {
    BoldText,
    Text: ReactNative.Text,
    Link,
  },
})

export default createTranslate({
  renderer: 'native',
  renderTranslated,
})
