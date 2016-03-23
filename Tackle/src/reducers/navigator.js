import { combineReducers } from 'redux'

import React, { NavigatorIOS } from 'react-native'

import { 
    GO_TO_LOGIN,
    GO_TO_HOME,
  } from '../actions/navigator'

import Login from '../containers/login'
import Home from '../containers/home'

/*tc*/export/*etc*/function handleGoToLogin(state, action) {
  return state
}

/*tc*/export/*etc*/function handleGoToHome(state, action) {
  console.log(state.navigator)
  /*state.navigator.replace({
        title: 'Home',
        component: Home,
      })*/
  return state
}

/*tc*/export/*etc*/function getInitialState() {
  return {
    navigator:<NavigatorIOS
                style={[{flex: 1}]}
                initialRoute={{
                  title: 'Tackle',
                  component: Login,
                }}/>
  }
}

/*tc*/export/*etc*/function navigator(state = getInitialState(), action) {
  switch (action.type) {
    case GO_TO_LOGIN:
      return handleGoToLogin(state, action)
    case GO_TO_HOME:
      return handleGoToHome(state, action)
    default:
      return state
  }
  return state
}

export default navigator