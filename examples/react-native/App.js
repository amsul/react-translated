/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'

import ExampleApp from './ExampleApp'

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

export default class App extends Component<{}> {
  render() {
    return (
      <ExampleApp
        Br={() => <Text>{'\n'}</Text>}
        Button={Button}
        Input={TextInput}
        StarIcon={StarIcon}
        ReactLogo={ReactLogo}
        Text={Text}
        View={View}
        styles={styles}
      />
    )
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
})
