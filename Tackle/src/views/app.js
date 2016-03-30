import React, {
  Component,
  NavigatorIOS,
  StyleSheet,
  View,
} from 'react-native'

import {
  Router, 
  routerReducer, 
  Route, 
  Container, 
  Animations, 
  Schema
} from 'react-native-redux-router'

var {NavBar, NavBarModal} = require('../components/NavBar');

import Login from '../containers/login'
import Home from '../containers/home'
import UserList from '../containers/userList'
import LevelSelection from '../containers/levelSelection'
import Game from '../containers/game'

class App extends Component{
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#F5FCFF'}}/>
        <Router>
          <Schema name="modal" sceneConfig={Animations.FlatFloatFromBottom} navBar={NavBarModal}/>
          <Schema name="default" sceneConfig={Animations.FlatFloatFromRight} navBar={NavBar}/>
          <Schema name="withoutAnimation" navBar={NavBar}/>
          <Schema name="tab" navBar={NavBar}/>

          <Route name="login" component={Login} initial={true} hideNavBar={true} title="Login"/>
          <Route name="home" component={Home} initial={false} hideNavBar={false} title="Home"/>
          <Route name="userList" component={UserList} initial={false} hideNavBar={false} title="UserList"/>
          <Route name="levelSelection" component={LevelSelection} initial={false} title="LevelSelection"/>
          <Route name="game" component={Game} initial={false} hideNavBar={false} title="Game"/>
        </Router>
      </View>
    )
  }
}

module.exports = App