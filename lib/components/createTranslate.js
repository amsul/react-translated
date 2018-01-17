// @flow

import type { RenderPropsType } from './createRenderer'

import * as propTypes from 'prop-types'
import * as React from 'react'
import { TranslatedShape } from '../constants'

type CreateTranslateType = ({
  renderer: 'native' | 'dom',
  renderTranslated: Object => React.Node,
}) => React.ComponentType<*>

type PropsType = RenderPropsType

const createTranslate: CreateTranslateType = ({ renderer, renderTranslated }) =>
  class Translate extends React.PureComponent<PropsType> {
    static contextTypes = {
      isInAParentText: renderer === 'native' ? propTypes.bool : propTypes.any,
      translated: TranslatedShape.isRequired,
    }

    render() {
      const { data, text, renderMap, onPressLink } = this.props
      const { translated } = this.context
      return renderTranslated({
        text,
        data,
        renderMap,
        translated,
        onPressLink,
      })
    }

    unsubscribe: () => void

    componentWillMount() {
      if (
        renderer === 'native' &&
        !this.props.render &&
        !this.context.isInAParentText
      ) {
        throw new Error('Cannot place translated text outside a text node')
      }
      this.unsubscribe = this.context.translated.subscribe(() =>
        this.forceUpdate(),
      )
    }

    componentWillUnmount() {
      this.unsubscribe()
    }
  }

export default createTranslate
