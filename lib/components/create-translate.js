// @flow

import * as propTypes from 'prop-types'
import * as React from 'react'

type CreateType = {
  renderer: 'native' | 'dom',
  renderTranslated: Object => Array<React.Element<*>>,
}

type PropsType = {
  text: string,
  data?: Object,
  renderMap?: { [string]: () => React.Node },
}

export default ({
  renderer,
  renderTranslated,
}: CreateType) => class Translate extends React.PureComponent<PropsType> {

  static contextTypes = {
    isInAParentText: renderer === 'native' ? propTypes.bool : propTypes.any,
    translated: propTypes.shape({
      getLanguage: propTypes.func.isRequired,
      getTranslation: propTypes.func.isRequired,
      subscribe: propTypes.func.isRequired,
    }).isRequired,
  }

  render() {
    const { data, text, renderMap } = this.props
    const { translated } = this.context
    return renderTranslated({
      text,
      data,
      renderMap,
      language: translated.getLanguage(),
      translation: translated.getTranslation(),
    })
  }

  componentWillMount() {
    if (renderer === 'native' && !this.context.isInAParentText) {
      throw new Error('Cannot place translated text outside a text node')
    }
    this.unsubscribe = this.context.translated.subscribe(() => this.forceUpdate())
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    const { text } = this.props
    console.error(`Unable to render translation text %o:\n${error.message}\n${error.stack}`, text)
  }

}
