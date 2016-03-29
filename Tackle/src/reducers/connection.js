import { combineReducers } from 'redux'
import { SERVER_URL } from '../constants/connection'
import { TOKEN_LOADED } from '../actions/login'

import '../UserAgent'
const io = require('socket.io-client/socket.io')

var { Actions } = require('react-native-redux-router')

/*tc*/export/*etc*/function getInitialState() {
  return {
    socket: undefined
  }
}

/*tc*/export/*etc*/function onTokenLoaded(state, action) {
  var opts = {
    query: {
      'token': action.token
    }
  }
  var socket = io(SERVER_URL, opts)
  socket.on('auth', function(auth) {
    if(auth.success) {
      Actions.home()
    }else{
      //TODO: What happens, if auth failed?
    }
  })
  return {
    socket: socket
  }
}

/*tc*/export/*etc*/function connection(state = getInitialState(), action) {
  switch (action.type) {
    case TOKEN_LOADED:
      return onTokenLoaded(state, action)
    default:
      return state
  }
  return state
}

export default connection