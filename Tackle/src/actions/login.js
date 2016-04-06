var request = require('superagent')
import * as Storage from '../store/localStorage'

import {
  SERVER_URL,
  LOGIN
} from '../constants/connection'

import {
  onUpdateUsers
} from '../actions/connection'

var { Actions } = require('react-native-redux-router')

export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const GET_NAME = 'GET_NAME'
export const NAME_LOADED = 'NAME_LOADED'
export const GET_TOKEN = 'GET_TOKEN'
export const TOKEN_LOADED = 'TOKEN_LOADED'
export const AUTH = 'AUTH'
export const AUTH_RESPONSE = 'AUTH_SUCCEEDED'

import { CONNECTION_FAILED } from './connection'

export function receiveLogin(name, response) {
  return {
    type: RECEIVE_LOGIN,
    name,
    response
  }
}

export function onNameLoaded(name) {
  return {
    type: NAME_LOADED,
    name
  }
}

export function getToken() {
  return (dispatch, getState) => {
    Storage.getToken().then(token => {
      dispatch(onTokenLoaded(token))
      Actions.home()
      doAuthIfNeeded(dispatch, getState())
    })
  }
}

export function onTokenLoaded(token) {
  return {
    type: TOKEN_LOADED,
    token
  }
}

export function getName() {
  return (dispatch, getState) => {
    Storage.getName().then(name => {
      dispatch(onNameLoaded(name))
      doAuthIfNeeded(dispatch, getState())
    })
  }
}

export function auth(token, socket) {
  return {
    type: AUTH,
    token,
    socket
  }
}

export function doAuthIfNeeded(dispatch, state) {
  var { token } = state.tackleApp.login
  var { socket } = state.tackleApp.connection
  if(token && socket) {
    dispatch(auth(token, socket))

    socket.on('connect_error', function(auth) {
      dispatch({type: CONNECTION_FAILED})
    })
    socket.on('auth', function(auth) {
      dispatch({type: AUTH_RESPONSE, success: auth.success})
    })
    socket.on('users', function(users) {
      dispatch(onUpdateUsers(users))
    })
  }
}

export function doLogin(name) {
  return (dispatch, getState) => {
    request
      .post(SERVER_URL + LOGIN + name)
      .end(function(err, res){
        dispatch(receiveLogin(name, res))
        dispatch(getToken())
      })
  }
}