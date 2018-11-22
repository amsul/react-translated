// @flow

import type { RenderPropsType } from './createRenderer'

import * as React from 'react'
import createSubscribe from './createSubscribe'

type CreateTranslateType = ({
  renderer: 'native' | 'dom',
  renderTranslated: Object => React.Node,
  TextAncestor?: any,
}) => React.ComponentType<*>

type PropsType = RenderPropsType

const createTranslate: CreateTranslateType = ({
  renderer,
  renderTranslated,
  TextAncestor,
}) => {
  class Translate extends React.Component<PropsType> {
    render() {
      if (!TextAncestor) {
        return this.renderText()
      }
      return (
        <TextAncestor.Consumer>
          {hasAncestor => {
            if (!hasAncestor) {
              throw new Error(
                'Cannot place translated text outside a text node',
              )
            }
            return this.renderText()
          }}
        </TextAncestor.Consumer>
      )
    }

    renderText() {
      const { data, text, renderMap, onPressLink, translated } = this.props
      return renderTranslated({
        text,
        data,
        renderMap,
        translated,
        onPressLink,
      })
    }
  }

  return createSubscribe({ Component: Translate })
}

export default createTranslate
