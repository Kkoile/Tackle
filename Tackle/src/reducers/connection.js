import { combineReducers } from 'redux'
import { SERVER_URL } from '../constants/connection'
import { TOKEN_LOADED } from '../actions/login'
import { 
  UPDATE_USERS, 
  PLAY_VIA_INTERNET,
  USER_PRESSED
} from '../actions/connection'

import '../UserAgent'
const io = require('socket.io-client/socket.io')

var { Actions } = require('react-native-redux-router')

/*tc*/export/*etc*/function getInitialState() {
  return {
    socket: undefined,
    users: []
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

/*tc*/export/*etc*/function onPlayViaInternet(state, action) {
  var socket = state.socket
  socket.emit('ready', true)
  return state
}

/*tc*/export/*etc*/function onUpdateUsers(state, action) {
  state.users = action.users
  return state
}

/*tc*/export/*etc*/function onUserPressed(state, action) {
  var socket = state.socket
  var user = action.user
  socket.emit('attack', {
    username: user
  })
  return state
}

/*tc*/export/*etc*/function connection(state = getInitialState(), action) {
  switch (action.type) {
    case TOKEN_LOADED:
      return onTokenLoaded(state, action)
    case PLAY_VIA_INTERNET:
      return onPlayViaInternet(state, action)
    case UPDATE_USERS:
      return onUpdateUsers(state, action)
    case USER_PRESSED:
      return onUserPressed(state, action)
    default:
      return state
  }
  return state
}

export default connection