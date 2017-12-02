import { tag } from 'template-literals'

export default {

  // Full example
  'Simple *translations* in React <ReactLogo>': {
    en: 'Simple *translations* in React <ReactLogo>',
    fr: 'Des traductions simples dans React <ReactLogo>',
  },


  // Static text
  'Hi World!': {
    en: 'Hi World!',
    fr: 'Salut mon pote!',
  },

  // Templated text
  'Hi {firstName}!': {
    en: tag `Hi ${'firstName'}!`,
    fr: tag `Salut ${'firstName'}!`,
  },

  // Dynamically templated text
  'There are {catsCount} cats in this room.': {
    en({ catsCount }) {
      if (catsCount === 1) {
        return tag `There is ${'catsCount'} cat in this room.`
      }
      return tag `There are ${'catsCount'} cats in this room.`
    },
    fr({ catsCount }) {
      if (catsCount === 1) {
        return tag `Il y a ${'catsCount'} chat dans cette pièce.`
      }
      return tag `Il y a ${'catsCount'} chats dans cette pièce.`
    },
  },
  'This is a {fruit}': {
    en({ fruit }) {
      if (/^[aeiou]/.test(fruit)) {
        return tag `This is an ${'fruit'}`
      }
      return tag `This is a ${'fruit'}`
    },
    fr({ fruit }) {
      return 'TBD'
    },
  },

  // Styled text
  'Hi *World*!': {
    en: 'Hi *World*!',
    fr: 'Salut mon *pote*!',
  },
  'Hi *{firstName}*!': {
    en: tag `Hi *${'firstName'}*!`,
    fr: tag `Salut *${'firstName'}*!`,
  },

  // Component within text
  'Tap the <StarIcon> to add': {
    en: 'Tap the <StarIcon> to add',
    fr: 'Appuyez sur la <StarIcon> pour ajouter',
  },
  'I was born in <MonthName>': {
    en: 'I was born in <MonthName>',
    fr: 'Je suis né en <MonthName>',
  },
  'August': {
    en: 'August',
    fr: 'août',
  },

}
