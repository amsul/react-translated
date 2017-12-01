// @flow

import * as React from 'react'



type CreateRendererType = ({ styleSheet: Object, TextComponent: React.ComponentType<*> }) => (
  ({
    text: string,
    data?: Object,
    renderMap?: { [string]: () => React.Node },
    language: string,
    translation: Object,
  }) => Array<React.Element<*>>
)

export const createRenderer: CreateRendererType = ({ styleSheet, TextComponent }) => (
  ({ text, data, renderMap, language, translation }) => {
    if (!translation || !language) {
      throw new Error('No translation data provided. Make sure your <Provider> is set up correctly.')
    }
    const translatedText = getTranslatedText({ data, language, text, translation })
    return render({ renderMap, string: translatedText, styleSheet, TextComponent })
  }
)



///////////////
// TRANSLATE //
///////////////

const getTranslatedText = ({ data, language, text, translation }) => {
  const template = translation && translation[text] ? translation[text][language] : undefined
  if (!template) {
    throw new Error(
      `Unable to find the "${language}" translation for "${text}"`
    )
  }
  if (typeof template === 'string') {
    return template
  }
  const translatedText = template(data)
  return typeof translatedText === 'string' ? translatedText : translatedText(data)
}



////////////
// RENDER //
////////////

const render = ({ renderMap, string, styleSheet, TextComponent }) => {
  let chunks = [string]
  chunks = renderCustomComponents({ chunks, renderMap })
  chunks = renderBoldText({ chunks, styleSheet, TextComponent })
  return chunks.map((chunk, index) => {
    if (typeof chunk === 'string') {
      return <TextComponent key={index}>{chunk}</TextComponent>
    }
    return React.cloneElement(chunk, { key: index })
  })
}

const renderCustomComponents = ({ chunks, renderMap }) => {
  if (!renderMap) {
    return chunks
  }
  return matchAndRender({
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
}

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
