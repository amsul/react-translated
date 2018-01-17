// @flow

import type { TranslatedType } from '../constants'

import basicParser from 'basic-parser'
import * as React from 'react'
import * as renderer from '../renderer'
import * as utils from '../utils'

export type RenderPropsType = {
  text: string,
  data?: Object,
  renderMap?: { [string]: () => React.Node },
  onPressLink?: () => mixed,
  translated: TranslatedType,
}

type CreateRendererType = ({
  Component: { [string]: React.ComponentType<*> },
}) => RenderPropsType => React.Node

const createRenderer: CreateRendererType = ({ Component }) => {
  const render = basicParser({
    renderers: [
      renderer.getForBoldText({ Component }),
      renderer.getForLinkText({ Component }),
      renderer.getForCustomComponents(),
    ],
  })
  return ({
    text,
    data,
    renderMap,
    translated,
    onPressLink,
  }: RenderPropsType) => {
    const translatedText = utils.getTranslatedText({ data, text, translated })
    const renderedText = renderer.interpolateData({
      data,
      text: translatedText || text,
    })

    const chunks = render({
      data: { templateData: data, onPressLink, renderMap },
      text: renderedText,
    }).map(
      (chunk, index) =>
        typeof chunk === 'string'
          ? chunk
          : React.cloneElement(chunk, { key: index }),
    )

    const isDebugging = translated.getIsDebugging()
    const isMissing = !translatedText
    if (!isDebugging || !isMissing) {
      return chunks
    }
    const style = { backgroundColor: 'red' }
    return <Component.Text style={style}>{chunks}</Component.Text>
  }
}

export default createRenderer
