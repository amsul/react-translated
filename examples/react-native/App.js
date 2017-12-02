/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ReactTranslated from './dist/react-translated'
import translation from './translation'

const StarIcon = ({ size }: { size: number }) => (
  <Image
    style={{ width: size, height: size }}
    source={{ uri: 'https://i.imgur.com/0baclSU.png' }}
    />
)

const ReactLogo = ({ size }: { size: number }) => (
  <Image
    style={{ width: size, height: size }}
    source={{ uri: 'https://i.imgur.com/nakYmC1.png' }}
    />
)

class PreventingUpdates extends Component {
  render() {
    return (
      <Text style={styles.instructions}>
        <ReactTranslated.Translate text='Hi World!' />
      </Text>
    )
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
}

export default class App extends Component<{}> {
  state = {
    language: 'en'
  }
  onPressSwitchLanguage() {
    const language = {
      en: 'fr',
      fr: 'en',
    }[this.state.language]
    this.setState({ language })
  }
  render() {
    const { language } = this.state
    return (
      <ReactTranslated.Provider language={language} translation={translation}>
        <View style={styles.container}>
          <Text style={styles.instructions}>Language: {language}</Text>
          <Button
            onPress={() => this.onPressSwitchLanguage()}
            title='Switch language'
            />
          <PreventingUpdates />
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='Simple *translations* in React <ReactLogo>'
              renderMap={{
                renderReactLogo: () => <ReactLogo size={14} />,
              }}
              />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate text='Hi World!' />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='Hi {firstName}!'
              data={{ firstName: 'Sergey' }}
              />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='There are {catsCount} cats in this room.'
              data={{ catsCount: 2 }}
              />
            {'\n'}
            <ReactTranslated.Translate
              text='There are {catsCount} cats in this room.'
              data={{ catsCount: 1 }}
              />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='This is a {fruit}'
              data={{ fruit: 'banana' }}
              />
            {'\n'}
            <ReactTranslated.Translate
              text='This is a {fruit}'
              data={{ fruit: 'apple' }}
              />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='Hi *World*!'
              />
            {'\n'}
            <ReactTranslated.Translate
              text='Hi *{firstName}*!'
              data={{ firstName: 'Sergey' }}
              />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='Tap the <StarIcon> to add'
              renderMap={{
                renderStarIcon: () => <StarIcon size={14} />,
              }}
              />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='I was born in <MonthName>'
              renderMap={{
                renderMonthName: () => <ReactTranslated.Translate text='August' />
              }}
              />
          </Text>
        </View>
      </ReactTranslated.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
});
