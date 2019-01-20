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
import {connect} from 'react-redux';
import {changeHome, changeView} from './actions/index';


class App extends Component {

  constructor(props){
    super(props);
    firebase.initializeApp(config);
    //console.log(this.props.store);
    //this.props.dispatch({type:'CHANGE_PAGE', payload: 'View'});
    console.log(this.props.page);
  }

  onComponentDidMount(){
    console.log(this.props.state);
  }
  render() {

    return (
      <div className="App">
      <Header store={this.props.store} dispatch={this.props.dispatch}/>
      {this.props.page.page == 'Home' &&
        <Senddata db={firebase}/>
        ||
        this.props.page.page == 'View' &&
        <Dashboard db={firebase}/>
      }
      </div>
    );
  }
}


const mapStateToProps = store => ({
  page: store.pageChange
});


export default connect(mapStateToProps, null)(App);
