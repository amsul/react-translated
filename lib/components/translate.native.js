// @flow

import * as propTypes from 'prop-types'
import * as React from 'react'
import ReactNative from 'react-native'

import * as utils from '../utils'



type PropsType = {
  text: string,
  data?: Object,
  renderMap?: { [string]: () => React.Node },
}

export default class Translate extends React.PureComponent<PropsType> {

  static contextTypes = {
    isInAParentText: propTypes.bool,
    language: propTypes.string.isRequired,
    translation: propTypes.object.isRequired,
  }

  render() {
    const { data, text, renderMap } = this.props
    const { language, translation } = this.context
    return renderTranslated({
      text,
      data,
      renderMap,
      language,
      translation,
    })
  }

  componentWillMount() {
    if (!this.context.isInAParentText) {
      throw new Error('Cannot place translated text outside a text node')
    }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    const { text } = this.props
    console.error(`Unable to render translation text %o:\n${error.message}\n${error.stack}`, text)
  }

}



const styleSheet = ReactNative.StyleSheet.create({
  bold: { fontWeight: 'bold' },
})

const renderTranslated = utils.createRenderer({
  styleSheet,
  TextComponent: ReactNative.Text,
})
