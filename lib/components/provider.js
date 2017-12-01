// @flow

import * as propTypes from 'prop-types'
import * as React from 'react'

type PropsType = {
  language: string,
  translation: Object,
  children: React.Element<*>,
}

export default class Provider extends React.Component<PropsType> {

  static childContextTypes = {
    language: propTypes.string.isRequired,
    translation: propTypes.object.isRequired,
  }

  getChildContext() {
    return {
      language: this.props.language,
      translation: this.props.translation,
    }
  }

  render() {
    return this.props.children
  }

}
