// @flow

import type { TranslatedType } from './constants'
import basicParser from 'basic-parser'
import * as React from 'react'

//////////////////
// MATCH RENDER //
//////////////////

type MatchRenderPropsType = {
  children: mixed[],
  data: {
    onPressLink: () => void,
    templateData?: Object,
    renderMap?: { [string]: (?Object) => React.Node },
  },
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
    const url = endMatches[0] || ''
    const onPress = data.onPressLink
    return (
      <Component.Link onPress={onPress} url={url}>
        {children}
      </Component.Link>
    )
  },
})

const getRendererForCustomComponents = () => ({
  match: { start: '<', end: '>' },
  render({ children, data }: MatchRenderPropsType) {
    const componentName = typeof children[0] === 'string' ? children[0] : ''
    const render = data.renderMap && data.renderMap[`render${componentName}`]
    if (!render) {
      throw new Error(`Render method "render${componentName}" not passed`)
    }
    return render(data.templateData)
  },
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

const variableRenderer = {
  match: { start: '\\{', end: '\\}' },
  render({ data, children }: { data: Object, children: string }) {
    return data[children] || ''
  },
}
const renderVariables = basicParser({ renderers: [variableRenderer] })

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

type CreateType = ({
  Component: { [string]: React.ComponentType<*> },
}) => RenderPropsType => React.Node

export const create: CreateType = ({ Component }) => {
  const renderers = [
    getRendererForBoldText({ Component }),
    getRendererForLinkText({ Component }),
    getRendererForCustomComponents(),
  ]
  const render = basicParser({ renderers })
  return ({
    text,
    data,
    renderMap,
    translated,
    onPressLink,
  }: RenderPropsType) => {
    const translation = translated.getTranslation()
    const language = translated.getLanguage()
    if (!translation || !language) {
      throw new Error(
        'No translation data provided. Make sure your <Provider> is set up correctly.',
      )
    }

    let template = getTemplate({ data, language, text, translation })
    template = renderVariables({ data, text: template }).join('')

    const renderMatchData = { templateData: data, onPressLink, renderMap }
    const chunks = render({ data: renderMatchData, text: template }).map(
      (chunk, index) =>
        typeof chunk === 'string'
          ? chunk
          : React.cloneElement(chunk, { key: index }),
    )

    const isDebugging = translated.getIsDebugging()
    const isMissing = !translation[text] || !translation[text][language]
    if (!isDebugging || !isMissing) {
      return chunks
    }
    const style = { backgroundColor: 'red' }
    return <Component.Text style={style}>{chunks}</Component.Text>
  }
}
