// @flow

import * as React from 'react'
import { TranslatedShape } from '../constants'

type PropsType = {
  isDebugging?: boolean,
  language: string,
  translation: Object,
  children: React.Element<*>,
}

export default class Provider extends React.Component<PropsType> {
  static childContextTypes = {
    translated: TranslatedShape.isRequired,
  }

  getChildContext() {
    return {
      translated: this.translated,
    }
  }

  translated = {
    getIsDebugging: () => !!this.props.isDebugging,
    getLanguage: () => this.props.language,
    getTranslation: () => this.props.translation,
    subscribe: (callback: () => void) => this.subscribe(callback),
  }

  listeners = []

  subscribe(callback: () => void) {
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

  componentWillReceiveProps(nextProps: PropsType) {
    if (
      this.props.language !== nextProps.language ||
      this.props.translation !== nextProps.translation
    ) {
      this.notify()
    }
  }

  render() {
    return this.props.children
  }
}
