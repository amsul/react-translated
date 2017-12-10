// @flow

import * as React from 'react'
import createTranslate from './create-translate'
import * as utils from '../utils'

const styleSheet = {
  link: { fontWeight: 'bold', textDecoration: 'underline' },
}

type LinkPropsType = { onPress?: ({ url: string }) => mixed, children: React.Node, url: string }
const Link = ({ onPress, children, url }: LinkPropsType) => (
  <a
    onClick={onPress ? () => onPress && onPress({ url }) : undefined}
    href={url}
    style={styleSheet.link}
    >
    {children}
  </a>
)

const renderTranslated = utils.createRenderer({
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
