// @flow

import * as utils from './utils'

type GetTranslatedParamsType = {
  isDebugging?: boolean,
  data?: Object,
  text: string,
  language: string,
  translation: Object,
}

export default ({
  data,
  text,
  language,
  translation,
  isDebugging,
}: GetTranslatedParamsType): string =>
  utils.getTranslatedText({
    data,
    text,
    translated: {
      getIsDebugging: () => !!isDebugging,
      getLanguage: () => language,
      getTranslation: () => translation,
    },
  })
