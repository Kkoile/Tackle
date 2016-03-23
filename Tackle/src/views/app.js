import React, {
  Component,
  NavigatorIOS,
  StyleSheet,
  View,
} from 'react-native'

import '../UserAgent'
import io from 'socket.io-client/socket.io'

import {
  Router, 
  routerReducer, 
  Route, 
  Container, 
  Animations, 
  Schema
} from 'react-native-redux-router'

import { SERVER_URL } from '../constants/connection'

import Login from '../containers/login'
import Home from '../containers/home'
import LevelSelection from '../containers/levelSelection'
import Game from '../containers/game'

class App extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#F5FCFF'}}/>
        <Router>
          <Route name="login" component={Login} initial={true} hideNavBar={true} title="Login"/>
          <Route name="home" component={Home} initial={false} hideNavBar={false} title="Home"/>
          <Route name="levelSelection" component={LevelSelection} initial={false} hideNavBar={true} title="LevelSelection"/>
          <Route name="game" component={Game} initial={false} hideNavBar={false} title="Game"/>
        </Router>
      </View>
    )
  }
}

module.exports = App
