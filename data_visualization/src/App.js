import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Senddata from './components/Senddata';
//import Firebase from './components/Firebase/firebase';
import firebase from 'firebase';
import config from './ignoreme';

class App extends Component {

  constructor(){
    super();
    firebase.initializeApp(config);
  }
  render() {
    return (
      <div className="App">
        <Senddata db={firebase}/>
      </div>
    );
  }
}

export default App;
