import * as PlayModes from '../constants/playModes'

export const FIELD_CLICKED = 'FIELD_CLICKED'
export const COMPUTERS_TURN = 'COMPUTERS_TURN'
export const OPPONENTS_TURN = 'OPPONENTS_TURN'
export const SET_OPPONENTS_TURN = 'SET_OPPONENTS_TURN'
export const NOTIFY_LEVEL_SELECTION = 'NOTIFY_LEVEL_SELECTION'
export const SELECT_LEVEL = 'SELECT_LEVEL'
export const STONE_CLICKED = 'STONE_CLICKED'
export const SET_PLAY_MODE = 'SET_PLAY_MODE'
export const RESET_GAME = 'RESET_GAME'
export const SET_PLAYER = 'SET_PLAYER'

export function fieldClickedAction(player, position) {
  return { type: FIELD_CLICKED, player, position }
}

export function letComputerMakeItsTurn() {
  return { type: COMPUTERS_TURN }
}

export function letOpponentMakeItsTurn(socket) {
  return { type: OPPONENTS_TURN, socket }
}

export function notifyOpponentOfLevelSelection(socket) {
  return { type: NOTIFY_LEVEL_SELECTION, socket }
}

export function selectLevelAction(level) {
  return { type: SELECT_LEVEL, level }
}

export function stoneClickedAction(stoneID) {
  return { type: STONE_CLICKED, stoneID }
}

export function setPlayMode(playMode) {
  return { type: SET_PLAY_MODE, playMode }
}

export function resetGame() {
  return { type: RESET_GAME }
}

export function setPlayer(isWhitePlayer) {
  return { type: SET_PLAYER, isWhitePlayer }
}

export function setOpponentsTurn(oppState) {
  return (dispatch, getState) => {
    dispatch({ type: SET_OPPONENTS_TURN, oppState })
  }
}

export function fieldClicked(player, position) {
  return (dispatch, getState) => {
    dispatch(fieldClickedAction(player, position))
    var { socket } = getState().tackleApp.connection
    dispatch(letOpponentMakeItsTurn(socket))
    setTimeout(() => {
      dispatch(letComputerMakeItsTurn())
    }, 500)
  }
}

export function stoneClicked(stoneID) {
  return (dispatch, getState) => {
    dispatch(stoneClickedAction(stoneID))
    var { socket } = getState().tackleApp.connection
    dispatch(letOpponentMakeItsTurn(socket))
    setTimeout(() => {
      dispatch(letComputerMakeItsTurn())
    }, 500)
  }
}

export function selectLevel(level) {
  return (dispatch, getState) => {
    dispatch(selectLevelAction(level))
    var { socket } = getState().tackleApp.connection
    dispatch(notifyOpponentOfLevelSelection(socket))
    setTimeout(() => {
      dispatch(letComputerMakeItsTurn())
    }, 500)
  }
}
