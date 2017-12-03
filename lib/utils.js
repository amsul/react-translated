// @flow

import type { TranslatedType } from '../constants'
import * as React from 'react'



//////////////////
// RENDER MATCH //
//////////////////

const renderCustomComponents = ({ chunks, data, renderMap }) => matchAndRender({
  chunks,
  regExp: /<(\w+?)>/g,
  render({ match }: { match: string }) {
    const render = renderMap && renderMap[`render${match}`]
    if (!render) {
      throw new Error(`Render method "render${match}" not passed`)
    }
    return render(data)
  },
})

const renderBoldText = ({ chunks, styleSheet, TextComponent }) => matchAndRender({
  chunks,
  regExp: /\*([^\n]+?)\*/g,
  render({ match }: { match: string }) {
    return <TextComponent style={styleSheet.bold}>{match}</TextComponent>
  },
})

const matchAndRender = ({ chunks, regExp, render }) => {
  const newChunks = []
  chunks.forEach((chunk) => {
    if (typeof chunk !== 'string') {
      newChunks.push(chunk)
      return
    }
    chunk.split(regExp).forEach((snippet, index) => {
      const newChunk = index % 2 ? render({ match: snippet }) : snippet
      newChunks.push(newChunk)
    })
  })
  return newChunks
}



/////////////////////
// RENDER TEMPLATE //
/////////////////////

const matchRenders = [
  renderCustomComponents,
  renderBoldText,
]

const renderTemplate = ({
  data,
  template,
  renderMap,
  styleSheet,
  TextComponent,
}) => {
  const text = matchAndRender({
    chunks: [template],
    regExp: /\{(\w+?)\}/g,
    render({ match }: { match: string }) {
      const value = data && data[match]
      if (value == null) {
        throw new Error(`Data key "${match}" not passed`)
      }
      return value
    },
  }).join('')
  let chunks = [text]
  chunks = matchRenders.reduce((chunks, matchRender) => matchRender({
    chunks,
    data,
    renderMap,
    styleSheet,
    TextComponent,
  }), chunks)
  return chunks.map((chunk, index) => {
    if (typeof chunk === 'string') {
      return <TextComponent key={index}>{chunk}</TextComponent>
    }
    return React.cloneElement(chunk, { key: index })
  })
}



/////////////
// CREATOR //
/////////////

type RenderPropsType = {
  text: string,
  data?: Object,
  renderMap?: { [string]: () => React.Node },
  translated: TranslatedType,
}

type CreateRendererType = ({
  styleSheet: Object,
  TextComponent: React.ComponentType<*>
}) => (
  RenderPropsType => Array<React.Element<*>>
)

export const createRenderer: CreateRendererType = ({ styleSheet, TextComponent }) => (
  ({ text, data, renderMap, translated }: RenderPropsType) => {

    const translation = translated.getTranslation()
    const language = translated.getLanguage()
    if (!translation || !language) {
      throw new Error('No translation data provided. Make sure your <Provider> is set up correctly.')
    }

    const template = getTemplate({ data, language, text, translation })
    const chunks = renderTemplate({
      data,
      template,
      renderMap,
      styleSheet,
      TextComponent,
    })

    const isDebugging = translated.getIsDebugging()
    const isMissing = !translation[text] || !translation[text][language]
    if (!isDebugging || !isMissing) {
      return chunks
    }
    const style = { backgroundColor: 'red' }
    return <TextComponent style={style}>{chunks}</TextComponent>
  }
)

const getTemplate = ({ data, language, text, translation }) => {

  // Grab the template from the translation data
  // and default to the text if none is found.
  let template = translation[text] ? translation[text][language] : undefined
  template = template || text

  // If it's a function, it is a dynamic template, so invoke it with the data
  // and return the final template
  return typeof template === 'string' ? template : template(data)
}
