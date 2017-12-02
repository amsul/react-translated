import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ReactTranslated from './dist/react-translated'
import translation from './translation'

const Text = 'p'

const StarIcon = ({ size }: { size: number }) => (
  <img
    style={{ width: size, height: size }}
    src='https://i.imgur.com/0baclSU.png'
    />
)

const ReactLogo = ({ size }: { size: number }) => (
  <img
    style={{ width: size, height: size }}
    src='https://i.imgur.com/nakYmC1.png'
    />
)

class App extends Component {
  render() {
    return (
      <ReactTranslated.Provider language='en' translation={translation}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <br /><br />
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
            <br />
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
            <br />
            <ReactTranslated.Translate
              text='This is a {fruit}'
              data={{ fruit: 'apple' }}
              />
          </Text>
          <Text style={styles.instructions}>
            <ReactTranslated.Translate
              text='Hi *World*!'
              />
            <br />
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
        </div>
      </ReactTranslated.Provider>
    );
  }
}

const styles = {
  instructions: {
    fontSize: 16,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
}

export default App;
