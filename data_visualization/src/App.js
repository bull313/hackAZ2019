import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Senddata from './components/Senddata';
//import Firebase from './components/Firebase/firebase';
import firebase from 'firebase';
import config from './ignoreme.json';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
class App extends Component {

  constructor(props){
    super(props);
    firebase.initializeApp(config);
    //console.log(this.props.store.getState().page.page);
    //this.props.store.dispatch(this.props.changePage({page:'View'}));
  }
  render() {
    return (
      <div className="App">
      <Header />
        <Senddata db={firebase}/>

      </div>
    );
  }
}

export default App;
