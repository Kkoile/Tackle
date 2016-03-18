export const FIELD_CLICKED = 'FIELD_CLICKED'
export const MAKE_TURN = 'MAKE_TURN'
export const SELECT_LEVEL = 'SELECT_LEVEL'
export const STONE_CLICKED = 'STONE_CLICKED'
export const SET_PLAY_MODE = 'SET_PLAY_MODE'
export const RESET_GAME = 'RESET_GAME'

export function fieldClicked(player, position) {
  return { type: FIELD_CLICKED, player, position }
}

export function makeTurn(player, turn) {
  return { type: MAKE_TURN, player, turn }
}

export function selectLevel(level) {
  return { type: SELECT_LEVEL, level }
}

export function stoneClicked(stoneID) {
  return { type: STONE_CLICKED, stoneID }
}

export function setPlayMode(playMode) {
  return { type: SET_PLAY_MODE, playMode }
}

export function resetGame() {
  return { type: RESET_GAME }
}