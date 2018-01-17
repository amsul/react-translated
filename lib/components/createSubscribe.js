// @flow

import * as React from 'react'
import { TranslatedShape } from '../constants'

type createSubscribeType = ({
  Component: React.ComponentType<*>,
}) => React.ComponentType<*>

const createSubscribe: createSubscribeType = ({ Component }) =>
  class Subscribe extends React.PureComponent<*> {
    static contextTypes = {
      translated: TranslatedShape.isRequired,
    }

    render() {
      return <Component {...this.props} translated={this.context.translated} />
    }

    unsubscribe: () => void

    componentWillMount() {
      this.unsubscribe = this.context.translated.subscribe(() =>
        this.forceUpdate(),
      )
    }

    componentWillUnmount() {
      this.unsubscribe()
    }
  }

export default createSubscribe
