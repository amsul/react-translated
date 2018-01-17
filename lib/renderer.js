// @flow

import basicParser from 'basic-parser'
import * as React from 'react'

///////////
// MATCH //
///////////

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

type GetRendererType<PropsType = void> = PropsType => {
  match: string | { start: string, end: string },
  render: MatchRenderPropsType => React.Node,
}

export const getForBoldText: GetRendererType<{ Component: Object }> = ({
  Component,
}) => ({
  match: '\\*',
  render({ children }: MatchRenderPropsType) {
    return <Component.BoldText>{children}</Component.BoldText>
  },
})

export const getForLinkText: GetRendererType<{ Component: Object }> = ({
  Component,
}) => ({
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

export const getForCustomComponents: GetRendererType<> = () => ({
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

///////////////
// VARIABLES //
///////////////

const variablesRenderer = {
  match: { start: '\\{', end: '\\}' },
  render({ data, children }: { data: Object, children: string }) {
    return data[children] || ''
  },
}

const renderVariables = basicParser({
  renderers: [variablesRenderer],
})

type InterpolateDataType = ({ data?: Object, text: string }) => string

export const interpolateData: InterpolateDataType = ({ data, text }) =>
  renderVariables({ data, text }).join('')
