import React, { Component } from 'react'
import './App.css'

import ExampleApp from './ExampleApp'

const StarIcon = ({ size }: { size: number }) => (
  <img
    style={{ width: size, height: size }}
    src="https://i.imgur.com/0baclSU.png"
  />
)

const ReactLogo = ({ size }: { size: number }) => (
  <img
    style={{ width: size, height: size }}
    src="https://i.imgur.com/nakYmC1.png"
  />
)

export default class App extends Component<{}> {
  render() {
    return (
      <ExampleApp
        Br="br"
        Button={({ title, onPress, ...props }) => (
          <button onClick={onPress} {...props}>
            {title}
          </button>
        )}
        Input={props => (
          <div>
            <input {...props} />
          </div>
        )}
        StarIcon={StarIcon}
        ReactLogo={ReactLogo}
        Text="p"
        InlineText="span"
        View="div"
        styles={styles}
      />
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 1.5,
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
}
