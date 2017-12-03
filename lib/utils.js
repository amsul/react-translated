// @flow

import * as React from 'react'
import { tag } from 'template-literals'



type CreateRendererType = ({ styleSheet: Object, TextComponent: React.ComponentType<*> }) => (
  ({
    text: string,
    data?: Object,
    renderMap?: { [string]: () => React.Node },
    isDebugging: boolean,
    language: string,
    translation: Object,
  }) => Array<React.Element<*>>
)

export const createRenderer: CreateRendererType = ({ styleSheet, TextComponent }) => (
  ({ text, data, renderMap, isDebugging, language, translation }) => {
    if (!translation || !language) {
      throw new Error('No translation data provided. Make sure your <Provider> is set up correctly.')
    }
    const translatedText = getTranslatedText({ data, language, text, translation })
    return render({
      isMissing: isDebugging && (!translation[text] || !translation[text][language]),
      renderMap,
      string: translatedText,
      styleSheet,
      TextComponent,
    })
  }
)



///////////////
// TRANSLATE //
///////////////

const createTemplate = ({ text }) => {
  const matches = text.split(/\{(\w+)\}/g)
  const strings = matches.filter((_, index) => index % 2 === 0)
  const keys = matches.filter((_, index) => index % 2 !== 0)
  if (!keys.length) {
    return text
  }
  return tag(strings, ...keys)
}

const getTranslatedText = ({ data, language, text, translation }) => {

  // Grab the template from the translation data
  // and default to the text if none is found.
  let template = translation[text] ? translation[text][language] : undefined
  template = template || text

  // If it's a template, it may be a dynamic template, so invoke it with the data.
  if (typeof template === 'function') {
    template = template(data)
  }

  // If it's a string, it may be a template, so create one.
  if (typeof template === 'string') {
    template = createTemplate({ text: template })
  }

  // If it's a string at this point, it has no data to interpolate.
  // Otherwise it's the final template so invoke it with the data.
  return typeof template === 'string' ? template : template(data)
}



////////////
// RENDER //
////////////

// eslint-disable-next-line react/prop-types
const render = ({ isMissing, renderMap, string, styleSheet, TextComponent }) => {
  let chunks = [string]
  chunks = renderCustomComponents({ chunks, renderMap })
  chunks = renderBoldText({ chunks, styleSheet, TextComponent })
  chunks = chunks.map((chunk, index) => {
    if (typeof chunk === 'string') {
      return <TextComponent key={index}>{chunk}</TextComponent>
    }
    return React.cloneElement(chunk, { key: index })
  })
  if (!isMissing) {
    return chunks
  }
  const style = { backgroundColor: 'red' }
  return <TextComponent style={style}>{chunks}</TextComponent>
}

const renderCustomComponents = ({ chunks, renderMap }) => matchAndRender({
  chunks,
  regExp: /<([^\n]+?)>/g,
  render({ match }: { match: string }) {
    const render = renderMap && renderMap[`render${match}`]
    if (!render) {
      throw new Error(`No render method found matching "${match}"`)
    }
    return render()
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
