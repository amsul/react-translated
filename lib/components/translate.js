// @flow

import * as React from 'react'
import createTranslate from './create-translate'
import * as utils from '../utils'

const styleSheet = {
  link: { fontWeight: 'bold', textDecoration: 'underline' },
}

const Link = ({ onPress, text, url }: { onPress: () => mixed, text: string, url: string }) => (
  <a
    onClick={() => onPress({ url })}
    style={styleSheet.link}
    >
    {text}
  </a>
)

const renderTranslated = utils.createRenderer({
  Component: {
    BoldText: 'b',
    Text: 'span',
    Link,
  },
})

export default createTranslate({
  renderer: 'dom',
  renderTranslated,
})
