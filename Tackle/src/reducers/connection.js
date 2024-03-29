import { combineReducers } from 'redux'
import { SERVER_URL } from '../constants/connection'
import { TOKEN_LOADED, AUTH_RESPONSE } from '../actions/login'
import { 
  UPDATE_USERS, 
  PLAY_VIA_INTERNET,
  USER_PRESSED,
  ATTACKED,
  REPLY_ATTACK,
  CONNECTION_FAILED
} from '../actions/connection'

import '../UserAgent'
const io = require('socket.io-client/socket.io')

var { Actions } = require('react-native-redux-router')

/*tc*/export/*etc*/function getInitialState() {
  return {
    socket: undefined,
    attacked: undefined,
    users: []
  }
}

/*tc*/export/*etc*/function onTokenLoaded(state, action) {
  var onlyLocal = true
  var opts = {
    query: {
      'token': action.token
    }
  }
  var socket = io(SERVER_URL, opts)
  return {
    onlyLocal: onlyLocal,
    socket: socket
  }
}

/*tc*/export/*etc*/function onAuthResponse(state, action) {
  if(action.success){
    state.onlyLocal = false
  }else{
    state.onlyLocal = true
  }
  return state
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

/*tc*/export/*etc*/function onAttacked(state, action) {
  state.attacked = action.data.username
  return state
}

/*tc*/export/*etc*/function onReplyAttack(state, action) {
  var socket = state.socket
  socket.emit('replyAttack', action.answer)
  if(!action.answer) {
    state.attacked = undefined
  }
  return state
}

/*tc*/export/*etc*/function onConnectionFailed(state, action) {
  state.onlyLocal = true
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
    case ATTACKED:
      return onAttacked(state, action)
    case REPLY_ATTACK:
      return onReplyAttack(state, action)
    case CONNECTION_FAILED:
      return onConnectionFailed(state, action)
    case AUTH_RESPONSE:
      return onAuthResponse(state, action)
    default:
      return state
  }
  return state
}

export default connection