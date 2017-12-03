// @flow

import type { TranslatedType } from '../constants'
import * as React from 'react'



//////////////////
// RENDER MATCH //
//////////////////

const renderCustomComponents = ({ chunks, data, renderMap }) => matchAndRender({
  chunks,
  regExp: /<(\w+?)>/g,
  render({ groups }: { groups: string[] }) {
    const render = renderMap && renderMap[`render${groups[0]}`]
    if (!render) {
      throw new Error(`Render method "render${groups[0]}" not passed`)
    }
    return render(data)
  },
})

const renderBoldText = ({ chunks, Component }) => matchAndRender({
  chunks,
  regExp: /\*([^\n]+?)\*/g,
  render({ groups }: { groups: string[] }) {
    return <Component.BoldText>{groups[0]}</Component.BoldText>
  },
})

const renderLinkText = ({ chunks, Component, onPressLink }) => matchAndRender({
  chunks,
  regExp: /\[([^\n]+?)\]\(([^\n]*?)\)/g,
  render({ groups }: { groups: string[] }) {
    const text = groups[0]
    const url = groups[1] || text
    return <Component.Link onPress={onPressLink} text={text} url={url} />
  },
})

const matchAndRender = ({ chunks, regExp, render }) => (
  chunks.reduce((chunks, chunk) => {

    const matches = typeof chunk === 'string' ? chunk.match(regExp) : undefined
    if (!matches) {
      chunks.push(chunk)
      return chunks
    }

    matches.forEach((match) => {

      const splitGroups = match.split(regExp)
      const groups = splitGroups.filter((_, index) => index !== 0 && index !== splitGroups.length - 1)

      const lastBeforeIndex = chunk.indexOf(groups[0]) - 1
      const beforeMatch = lastBeforeIndex > -1 ? chunk.slice(0, lastBeforeIndex) : ''

      chunks.push(beforeMatch + splitGroups[0])
      chunks.push(render({ groups }))

      chunk = chunk.slice(beforeMatch.length + match.length)

    })

    chunks.push(chunk)
    return chunks
  }, [])
)



/////////////////////
// RENDER TEMPLATE //
/////////////////////

const matchRenders = [
  renderCustomComponents,
  renderLinkText,
  renderBoldText,
]

const renderTemplate = ({
  data,
  template,
  renderMap,
  Component,
  onPressLink,
}) => {

  const text = matchAndRender({
    chunks: [template],
    regExp: /\{(\w+?)\}/g,
    render({ groups }: { groups: string[] }) {
      const value = data && data[groups[0]]
      if (value == null) {
        throw new Error(`Data key "${groups[0]}" not passed`)
      }
      return value
    },
  }).join('')

  return matchRenders
    .reduce((chunks, matchRender) => matchRender({
      chunks,
      data,
      renderMap,
      Component,
      onPressLink,
    }), [text])
    .map((chunk, index) => {
      if (typeof chunk === 'string') {
        return <Component.Text key={index}>{chunk}</Component.Text>
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
  onPressLink?: () => mixed,
  translated: TranslatedType,
}

type CreateRendererType = ({
  Component: { [string]: React.ComponentType<*> },
}) => (
  RenderPropsType => Array<React.Element<*>>
)

export const createRenderer: CreateRendererType = ({ Component }) => (
  ({ text, data, renderMap, translated, onPressLink }: RenderPropsType) => {

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
      Component,
      onPressLink,
    })

    const isDebugging = translated.getIsDebugging()
    const isMissing = !translation[text] || !translation[text][language]
    if (!isDebugging || !isMissing) {
      return chunks
    }
    const style = { backgroundColor: 'red' }
    return <Component.Text style={style}>{chunks}</Component.Text>
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
