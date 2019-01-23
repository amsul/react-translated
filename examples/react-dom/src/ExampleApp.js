import * as React from 'react'

import ReactTranslated from './dist/react-translated'
import translation from './translation'

class PreventingUpdates extends React.Component {
  render() {
    const { Text, styles } = this.props
    return (
      <Text style={styles.instructions}>
        <ReactTranslated.Translate text="Hi World!" />
      </Text>
    )
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false
  }
}

export default class ExampleApp extends React.Component {
  state = {
    language: 'en',
  }
  onPressSwitchLanguage() {
    const language = {
      en: 'fr',
      fr: 'en',
    }[this.state.language]
    this.setState({ language })
  }
  render() {
    const {
      Br,
      Button,
      Input,
      Text,
      InlineText,
      StarIcon,
      ReactLogo,
      View,
      styles,
    } = this.props
    const { language } = this.state

    const PurpleText = ({ key, children }) => (
      <InlineText key={key} style={{ color: 'pink' }}>
        {children}
      </InlineText>
    )

    return (
      <ReactTranslated.Provider
        // isDebugging={true}
        language={language}
        translation={translation}
      >
        <View style={styles.container}>
          <Text style={styles.instructions}>Language: {language}</Text>
          <Button
            onPress={() => this.onPressSwitchLanguage()}
            title="Switch language"
          />
          <Text style={styles.instructions}>
            Untranslated&hellip;&nbsp;
            <ReactTranslated.Translate
              data={{ firstName: 'Pete' }}
              text="Whoa *{firstName}*!"
            />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              onPressLink={({ url }) => alert(url)}
              text="Simple [translations](google.com) and [hotmail.com]() :)"
              // text='Simple *translations* in _*React*_ _logo_ *_React_* _*React_* *_React*_'
              // text='Simple _*React*_ translations *_React_* dopeness! *extreme*'
              // text='*_React_* _dopeness_! *extreme* and _*also*_ some *very _long_ bold text*'
              // text='*_React_*'
            />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text="Simple *translations* in React <ReactLogo>"
              renderMap={{
                renderReactLogo: () => <ReactLogo size={14} />,
              }}
            />
          </Text>
          <PreventingUpdates {...this.props} />
          <Text style={styles.instructions}>
            <ReactTranslated.Translate text="Hi World!" />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text="Hi {firstName}!"
              data={{ firstName: 'Sergey' }}
            />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text="There are {catsCount} cats in this room."
              data={{ catsCount: 2 }}
            />
            <Br />
            <ReactTranslated.Translate
              text="There are {catsCount} cats in this room."
              data={{ catsCount: 1 }}
            />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text="This is a {fruit}"
              data={{ fruit: 'banana' }}
            />
            <Br />
            <ReactTranslated.Translate
              text="This is a {fruit}"
              data={{ fruit: 'apple' }}
            />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate text="Hi *World*!" />
            <Br />
            <ReactTranslated.Translate
              text="Hi *{firstName}*!"
              data={{ firstName: 'Sergey' }}
            />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text="Tap the <StarIcon> to add"
              renderMap={{
                renderStarIcon: () => <StarIcon size={14} />,
              }}
            />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text="I was born in <MonthName>"
              renderMap={{
                renderMonthName: () => (
                  <ReactTranslated.Translate text="August" />
                ),
              }}
            />
          </Text>
          <ReactTranslated.Translator>
            {({ translate }) => (
              <View>
                <Input
                  placeholder={translate({
                    text: 'Enter your age {firstName}',
                    data: { firstName: 'Sergey' },
                  })}
                />
                <Input placeholder={translate({ text: 'Hi World!' })} />
              </View>
            )}
          </ReactTranslated.Translator>
          <Text style={styles.instructions}>
            Custom inline renderer&hellip;&nbsp;
            <ReactTranslated.Translate
              text="To ^custom emphasize^ some words."
              renderers={[
                {
                  match: '\\^',
                  render: PurpleText,
                },
              ]}
            />
          </Text>
        </View>
      </ReactTranslated.Provider>
    )
  }
}
