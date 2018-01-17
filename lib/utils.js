// @flow

import type { TranslatedType } from './constants'

type GetTranslatedTextType = ({
  data?: Object,
  text: string,
  translated: TranslatedType,
}) => string

export const getTranslatedText: GetTranslatedTextType = ({
  data,
  text,
  translated,
}) => {
  const translation = translated.getTranslation()
  const language = translated.getLanguage()
  if (!translation || !language) {
    throw new Error(
      'No translation data provided. Make sure your <Provider> is set up correctly.',
    )
  }

  // Grab the template from the translation data
  // and default to the text if none is found.
  const template = translation[text] ? translation[text][language] : undefined

  // If it's a function, it is a dynamic template, so invoke it with the data
  // and return the final template
  const translatedText =
    typeof template === 'function' ? template(data || {}) : template
  return typeof translatedText === 'string' ? translatedText : ''
}
