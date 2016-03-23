import { combineReducers } from 'redux'
import { SERVER_URL } from '../constants/connection'

import '../UserAgent'
import io from 'socket.io-client/socket.io'

/*tc*/export/*etc*/function getInitialState() {
  var socket = io(SERVER_URL)
  socket.on('connect', function(auth) {console.log(auth)} )
  socket.on('connect_error', function(auth) {console.log(auth)} )
  socket.on('auth', function(auth) {console.log(auth)} )
  return {
    socket: socket
  }
}

/*tc*/export/*etc*/function connection(state = getInitialState(), action) {
  switch (action.type) {
    default:
      return state
  }
  return state
}

export default connection