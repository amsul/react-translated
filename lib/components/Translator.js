// @flow

import type { TranslatedType } from '../constants'

import * as React from 'react'
import * as renderer from '../renderer'
import * as utils from '../utils'
import createSubscribe from './createSubscribe'

type PropsType = {
  children: ({
    translate: ({ data?: Object, text: string }) => string,
  }) => React.Node,
  translated: TranslatedType,
}

class Translator extends React.Component<PropsType> {
  render() {
    const { children } = this.props
    return children({
      translate: ({ data, text }) => this.translate({ data, text }),
    })
  }

  translate({ data, text }) {
    const { translated } = this.props
    const translatedText = utils.getTranslatedText({
      data,
      text,
      translated,
    })
    return renderer.interpolateData({ data, text: translatedText })
  }
}

export default createSubscribe({ Component: Translator })
