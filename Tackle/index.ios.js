'use strict';
import React, {
  AppRegistry,
  Component,
  NavigatorIOS,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Router, 
  routerReducer, 
  Route, 
  Container, 
  Animations, 
  Schema
} from 'react-native-redux-router'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import {Provider} from 'react-redux'
import tackleApp from './src/reducers/index'
import thunkMiddleware from 'redux-thunk'

const finalCreateStore = compose(
  applyMiddleware(thunkMiddleware)
)(createStore)

let store = finalCreateStore(combineReducers({routerReducer, tackleApp}))

import App from './src/views/app'

class Tackle extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('Tackle', () => Tackle);
