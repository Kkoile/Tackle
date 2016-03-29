import { combineReducers } from 'redux'
import { States } from '../constants/login'
import * as Storage from '../store/localStorage'

import { 
    RECEIVE_LOGIN,
    NAME_LOADED,
    TOKEN_LOADED,
    AUTH
  } from '../actions/login'

var { Actions } = require('react-native-redux-router')

/*tc*/export/*etc*/function loginHasSucceeded(res) {
  if(res.status == 200) {
    return true
  }
  return false
}

/*tc*/export/*etc*/function userNameIsAlreadyTaken(res) {
  if(res.status == 401) {
    return true
  }
  return false
}

/*tc*/export/*etc*/function getStateWithUserNameIsAlreadyTaken(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState.state = States.USER_NAME_ALREADY_TAKEN
  newState.userName = action.name
  return newState
}

/*tc*/export/*etc*/function finishLogin(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState.state = States.SUCCEEDED
  newState.userName = action.name
  newState.token = action.response.body.token
  Storage.saveToken(newState.token)
  Storage.saveName(newState.userName)
  return newState
}

/*tc*/export/*etc*/function handleReceiveLogin(state, action) {
  console.log(action)
  if(loginHasSucceeded(action.response)) {
    return finishLogin(state, action)
  }
  if(userNameIsAlreadyTaken(action.response)) {
    return getStateWithUserNameIsAlreadyTaken(state, action)
  }
  return state
}

/*tc*/export/*etc*/function handleNameLoaded(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState.userName = action.name
  return newState
}

/*tc*/export/*etc*/function handleTokenLoaded(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState.token = action.token
  return newState
}

/*tc*/export/*etc*/function handleAuth(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  var socket = action.socket
  socket.emit('auth', {token: action.token})
  return newState
}

/*tc*/export/*etc*/function getInitialState() {
  return {}
}

/*tc*/export/*etc*/function login(state = getInitialState(), action) {
  switch (action.type) {
    case RECEIVE_LOGIN:
      return handleReceiveLogin(state, action)
    case NAME_LOADED:
      return handleNameLoaded(state, action)
    case TOKEN_LOADED:
      return handleTokenLoaded(state, action)
    case AUTH:
      return handleAuth(state, action)
    default:
      return state
  }
  return state
}

export default login