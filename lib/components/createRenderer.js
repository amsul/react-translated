// @flow

import type { TranslatedType } from '../constants'

import basicParser from 'basic-parser'
import * as React from 'react'
import * as renderer from '../renderer'
import * as utils from '../utils'

type CustomMatchRenderPropsType = {
  key: string,
  children: string,
  data?: Object,
  startMatches: string[],
  endMatches: string[],
}

export type RenderPropsType = {
  text: string,
  data?: Object,
  renderMap?: { [string]: () => React.Node },
  renderers?: Array<{
    match: string | { start: string, end: string },
    render: React.ComponentType<CustomMatchRenderPropsType>,
  }>,
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
      renderer.getForItalicText({ Component }),
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
    renderers,
  }: RenderPropsType) => {
    const translatedText = utils.getTranslatedText({ data, text, translated })
    const renderedText = renderer.interpolateData({
      data,
      text: translatedText || text,
    })

    const customRender = renderers ? basicParser({ renderers }) : undefined

    const chunks = render({
      data: { templateData: data, onPressLink, renderMap },
      text: renderedText,
    }).map((chunk, index) => {
      if (typeof chunk !== 'string') {
        return React.cloneElement(chunk, { key: index })
      }
      if (customRender) {
        return customRender({ text: chunk })
      }
      return chunk
    })

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
