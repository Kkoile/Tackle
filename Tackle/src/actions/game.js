export const FIELD_CLICKED = 'FIELD_CLICKED'
export const COMPUTERS_TURN = 'COMPUTERS_TURN'
export const SELECT_LEVEL = 'SELECT_LEVEL'
export const STONE_CLICKED = 'STONE_CLICKED'
export const SET_PLAY_MODE = 'SET_PLAY_MODE'
export const RESET_GAME = 'RESET_GAME'

export function fieldClickedAction(player, position) {
  return { type: FIELD_CLICKED, player, position }
}

export function letComputerMakeItsTurn() {
  return { type: COMPUTERS_TURN }
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

export function fieldClicked(player, position) {
  return (dispatch, getState) => {
    dispatch(fieldClickedAction(player, position))
    setTimeout(() => {
      dispatch(letComputerMakeItsTurn())
    }, 500)
  }
}

export function stoneClicked(stoneID) {
  return (dispatch, getState) => {
    dispatch(stoneClickedAction(stoneID))
    setTimeout(() => {
      dispatch(letComputerMakeItsTurn())
    }, 500)
  }
}

export function selectLevel(level) {
  return (dispatch, getState) => {
    dispatch(selectLevelAction(level))
    setTimeout(() => {
      dispatch(letComputerMakeItsTurn())
    }, 500)
  }
}
