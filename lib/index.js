// @flow

import { tag } from 'template-literals'
import { default as Provider } from './components/provider'
import { default as Translate } from './components/translate'

export { tag } from 'template-literals'
export { default as Provider } from './components/provider'
export { default as Translate } from './components/translate'

export default {
  tag,
  Provider,
  Translate,
}
