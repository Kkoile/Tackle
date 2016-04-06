import { 
  setPlayer,
  selectLevel,
  setOpponentsTurn
} from '../actions/game'

var { Actions } = require('react-native-redux-router')

export const UPDATE_USERS = 'UPDATE_USERS'
export const PLAY_VIA_INTERNET = 'PLAY_VIA_INTERNET'
export const USER_PRESSED = 'USER_PRESSED'
export const ATTACKED = 'ATTACKED'
export const REPLY_ATTACK = 'REPLY_ATTACK'
export const CHOOSE_LEVEL = 'CHOOSE_LEVEL'
export const CONNECTION_FAILED = 'CONNECTION_FAILED'

export function onUpdateUsers(users) {
  return {
    type: UPDATE_USERS,
    users
  }
}

export function onPlayViaInternet() {
  return (dispatch, getState) => {
    dispatch({
      type: PLAY_VIA_INTERNET
    })
    getState().tackleApp.connection.socket.on('attack', function(data) {
      dispatch(onAttacked(data))
    })
  }
}

export function onAttacked(data) {
  return {
    type: ATTACKED,
    data
  }
}

export function chooseLevel(isWhitePlayer) {
  return (dispatch, getState) => {
    Actions.levelSelection()
    dispatch(setPlayer(isWhitePlayer))
    getState().tackleApp.connection.socket.on('levelSelection', function(level) {
      dispatch(selectLevel(level))
      Actions.game()
    })
    getState().tackleApp.connection.socket.on('turn', function(data) {
      dispatch(setOpponentsTurn(data))
    })
  }
}

export function onUserPressed(user) {
  return (dispatch, getState) => {
    dispatch({
      type: USER_PRESSED,
      user
    })
    getState().tackleApp.connection.socket.on('startgame', function(data) {
      dispatch(chooseLevel(data))
    })
  }
}

export function replyAttack(answer) {
  return (dispatch, getState) => {
    dispatch({
      type: REPLY_ATTACK,
      answer
    })
    getState().tackleApp.connection.socket.on('startgame', function(data) {
      dispatch(chooseLevel(data))
    })
  }
}