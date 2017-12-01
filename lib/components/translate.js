// @flow

import * as propTypes from 'prop-types'
import * as React from 'react'
import ReactNative from 'react-native'



type PropsType = {
  text: string,
  data?: Object,
  renderMap?: { [string]: () => React.Node },
}

export default class Translate extends React.PureComponent<PropsType> {

  static contextTypes = {
    isInAParentText: propTypes.bool,
    language: propTypes.string.isRequired,
    translation: propTypes.object.isRequired,
  }

  render() {
    const { data, text, renderMap } = this.props
    const { language, translation } = this.context
    const translatedText = getTranslatedText({ data, language, text, translation })
    return parseElements({ renderMap, string: translatedText })
  }

  componentWillMount() {
    if (!this.context.isInAParentText) {
      throw new Error('Cannot place translated text outside a text node')
    }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    const { text } = this.props
    console.error(`Unable to parse translation text %o:\n${error.message}\n${error.stack}`, text)
  }

}



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



///////////
// PARSE //
///////////

const styleSheet = ReactNative.StyleSheet.create({
  bold: { fontWeight: 'bold' },
})

const parseElements = ({ renderMap, string }) => {
  let chunks = [string]
  chunks = parseCustomComponents({ chunks, renderMap })
  chunks = parseBoldText({ chunks })
  return chunks.map((chunk, index) => {
    if (typeof chunk === 'string') {
      return <ReactNative.Text key={index}>{chunk}</ReactNative.Text>
    }
    return React.cloneElement(chunk, { key: index })
  })
}

const parseCustomComponents = ({ chunks, renderMap }) => {
  if (!renderMap) {
    return chunks
  }
  return matchAndParse({
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

const parseBoldText = ({ chunks }) => matchAndParse({
  chunks,
  regExp: /\*([^\n]+?)\*/g,
  render({ match }: { match: string }) {
    return <ReactNative.Text style={styleSheet.bold}>{match}</ReactNative.Text>
  },
})

const matchAndParse = ({ chunks, regExp, render }) => {
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
