// @flow

import * as React from 'react'
import createTranslate from './createTranslate'
import * as renderer from '../renderer'

const styleSheet = {
  link: { fontWeight: 'bold', textDecoration: 'underline' },
}

type LinkPropsType = {
  onPress?: ({ url: string }) => mixed,
  children: React.Node,
  url: string,
}
const Link = ({ onPress, children, url }: LinkPropsType) => (
  <a
    onClick={onPress ? () => onPress && onPress({ url }) : undefined}
    href={url}
    style={styleSheet.link}
  >
    {children}
  </a>
)

const renderTranslated = renderer.create({
  Component: {
    BoldText: ('b': any),
    Text: ('span': any),
    Link,
  },
})

export default createTranslate({
  renderer: 'dom',
  renderTranslated,
})
