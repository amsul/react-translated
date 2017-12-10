// @flow

import type { TranslatedType } from '../constants'
import basicParser from 'basic-parser'
import * as React from 'react'



//////////////////
// MATCH RENDER //
//////////////////

type MatchRenderPropsType = {
  children: mixed[],
  data: { templateData?: Object, onPressLink: () => void },
  startMatches: string[],
  endMatches: string[],
}

const getRendererForBoldText = ({ Component }) => ({
  match: '\\*',
  render({ children }: MatchRenderPropsType) {
    return <Component.BoldText>{children}</Component.BoldText>
  },
})

const getRendererForLinkText = ({ Component }) => ({
  match: { start: '\\[', end: '\\]\\((.*?)\\)' },
  render({ children, data, endMatches }: MatchRenderPropsType) {
    const text = children
    const url = endMatches[0] || text
    const onPress = data.onPressLink
    return <Component.Link onPress={onPress} text={text} url={url} />
  },
})

const getRendererForCustomComponents = () => ({
  match: { start: '<', end: '>' },
  render({ children, data }: MatchRenderPropsType) {
    const render = data.renderMap && data.renderMap[`render${children}`]
    if (!render) {
      throw new Error(`Render method "render${children}" not passed`)
    }
    return render(data.templateData)
  }
})



//////////////
// TEMPLATE //
//////////////

const getTemplate = ({ data, language, text, translation }) => {

  // Grab the template from the translation data
  // and default to the text if none is found.
  let template = translation[text] ? translation[text][language] : undefined
  template = template || text

  // If it's a function, it is a dynamic template, so invoke it with the data
  // and return the final template
  return typeof template === 'string' ? template : template(data)
}



////////////
// CREATE //
////////////

type RenderPropsType = {
  text: string,
  data?: Object,
  renderMap?: { [string]: () => React.Node },
  onPressLink?: () => mixed,
  translated: TranslatedType,
}

type CreateRendererType = ({
  Component: { [string]: React.ComponentType<*> },
}) => (
  RenderPropsType => Array<React.Element<*>>
)

const variableRenderer = {
  match: { start: '\\{', end: '\\}' },
  render({ data, children }: MatchRenderPropsType) {
    return data[children] || ''
  },
}
const renderVariables = basicParser({ renderers: [variableRenderer] })

export const createRenderer: CreateRendererType = ({ Component }) => {
  const renderers = [
    getRendererForBoldText({ Component }),
    getRendererForLinkText({ Component }),
    getRendererForCustomComponents(),
  ]
  const render = basicParser({ renderers })
  return ({ text, data, renderMap, translated, onPressLink }: RenderPropsType) => {

    const translation = translated.getTranslation()
    const language = translated.getLanguage()
    if (!translation || !language) {
      throw new Error('No translation data provided. Make sure your <Provider> is set up correctly.')
    }

    let template = getTemplate({ data, language, text, translation })
    template = renderVariables({ data, text: template }).join('')

    const renderMatchData = { templateData: data, onPressLink, renderMap }
    const chunks = render({ data: renderMatchData, text: template }).map((chunk, index) => (
      typeof chunk === 'string' ? chunk : React.cloneElement(chunk, { key: index })
    ))

    const isDebugging = translated.getIsDebugging()
    const isMissing = !translation[text] || !translation[text][language]
    if (!isDebugging || !isMissing) {
      return chunks
    }
    const style = { backgroundColor: 'red' }
    return <Component.Text style={style}>{chunks}</Component.Text>
  }
}
