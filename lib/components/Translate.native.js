// @flow

import * as React from 'react'
import ReactNative from 'react-native'
import TextAncestor from 'react-native/Libraries/Text/TextAncestor'
import createTranslate from './createTranslate'
import createRenderer from './createRenderer'

const styleSheet = ReactNative.StyleSheet.create({
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  link: { textDecorationLine: 'underline' },
})

const BoldText = ({ children }: { children: React.Node }) => (
  <ReactNative.Text style={styleSheet.bold}>{children}</ReactNative.Text>
)

const ItalicText = ({ children }: { children: React.Node }) => (
  <ReactNative.Text style={styleSheet.italic}>{children}</ReactNative.Text>
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

const renderTranslated = createRenderer({
  Component: {
    BoldText,
    ItalicText,
    Text: ReactNative.Text,
    Link,
  },
})

export default createTranslate({
  renderer: 'native',
  renderTranslated,
  TextAncestor,
})
