// @flow

import type { RenderPropsType } from './createRenderer'

import * as propTypes from 'prop-types'
import * as React from 'react'
import createSubscribe from './createSubscribe'

type CreateTranslateType = ({
  renderer: 'native' | 'dom',
  renderTranslated: Object => React.Node,
}) => React.ComponentType<*>

type PropsType = RenderPropsType

const createTranslate: CreateTranslateType = ({
  renderer,
  renderTranslated,
}) => {
  class Translate extends React.Component<PropsType> {
    static contextTypes = {
      isInAParentText: renderer === 'native' ? propTypes.bool : propTypes.any,
    }

    render() {
      const { data, text, renderMap, onPressLink, translated } = this.props
      return renderTranslated({
        text,
        data,
        renderMap,
        translated,
        onPressLink,
      })
    }

    componentWillMount() {
      if (renderer === 'native' && !this.context.isInAParentText) {
        throw new Error('Cannot place translated text outside a text node')
      }
    }
  }
  return createSubscribe({ Component: Translate })
}

export default createTranslate
