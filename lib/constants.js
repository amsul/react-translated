// @flow

import * as propTypes from 'prop-types'

export type TranslatedType = {
  getIsDebugging: () => boolean,
  getLanguage: () => string,
  getTranslation: () => Object,
}

export const TranslatedShape = propTypes.shape({
  getLanguage: propTypes.func.isRequired,
  getTranslation: propTypes.func.isRequired,
  subscribe: propTypes.func.isRequired,
})
