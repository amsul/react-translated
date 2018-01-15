// @flow

import * as React from 'react'
import ReactNative from 'react-native'
import createTranslate from './create-translate'
import * as renderer from '../renderer'

const styleSheet = ReactNative.StyleSheet.create({
  bold: { fontWeight: 'bold' },
  link: { textDecorationLine: 'underline' },
})

const BoldText = ({ children }: { children: React.Node }) => (
  <ReactNative.Text style={styleSheet.bold}>{children}</ReactNative.Text>
)

type LinkPropsType = {
  onPress: ({ url: string }) => mixed,
  children: React.Node,
  url: string,
}
const Link = ({ onPress, children, url }: LinkPropsType) => (
  <ReactNative.Text
    onPress={() => onPress({ url })}
    style={[styleSheet.bold, styleSheet.link]}
  >
    {children}
  </ReactNative.Text>
)

const renderTranslated = renderer.create({
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
