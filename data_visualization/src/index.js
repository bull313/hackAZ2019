import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import * as serviceWorker from './serviceWorker';
//import Firebase, { FirebaseContext } from './components/Firebase';
import store from "./store/index";
import { changePage } from "./actions/index";

window.store = store;
window.changePage = changePage;

store.dispatch(changePage({page: 'Home'}));
//console.log(store.getState());

ReactDOM.render(
    <App store={store} changePage={changePage}/>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
