var request = require('superagent')
import * as Storage from '../store/localStorage'

import {
  SERVER_URL,
  LOGIN
} from '../constants/connection'

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const GET_NAME = 'GET_NAME'
export const NAME_LOADED = 'NAME_LOADED'
export const GET_TOKEN = 'GET_TOKEN'
export const TOKEN_LOADED = 'TOKEN_LOADED'
export const AUTH = 'AUTH'

var {Actions} = require('react-native-redux-router')

export function requestLogin(name) {
  return {
    type: REQUEST_LOGIN,
    name
  }
}

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

export function redirectToHomeIfNeeded(state) {
  var { token, userName } = state.tackleApp.login
  if(token && userName) {
    redirectToHome()
  }
}

export function redirectToHome() {
  Actions.home()
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
  if(token) {
    dispatch(auth(token, socket))
  }
}

export function doLogin(name) {
  return (dispatch, getState) => {
    dispatch(requestLogin(name))
    request
      .post(SERVER_URL + LOGIN + name)
      .end(function(err, res){
        dispatch(receiveLogin(name, res))
        doAuthIfNeeded(dispatch, getState())
      })
  }
}