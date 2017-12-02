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
    translated: propTypes.shape({
      getLanguage: propTypes.func.isRequired,
      getTranslation: propTypes.func.isRequired,
      subscribe: propTypes.func.isRequired,
    }).isRequired,
  }

  getChildContext() {
    return {
      translated: this.translated,
    }
  }

  translated = {
    getLanguage: () => this.props.language,
    getTranslation: () => this.props.translation,
    subscribe: callback => this.subscribe(callback)
  }

  listeners = []

  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  notify() {
    if (this.listeners) {
      this.listeners.forEach(listener => listener())
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.language !== nextProps.language
      ||
      this.props.translation !== nextProps.translation
    ) {
      this.notify()
    }
  }

  render() {
    return this.props.children
  }

}
