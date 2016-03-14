export const SET_STONE = 'SET_STONE'
export const SET_GOLDEN_STONE = 'SET_GOLDEN_STONE'
export const MAKE_TURN = 'MAKE_TURN'
export const SELECT_LEVEL = 'SELECT_LEVEL'

export function setStone(player, position) {
  return { type: SET_STONE, player, position }
}

export function setGoldenStone(position) {
  return { type: SET_GOLDEN_STONE, position }
}

export function makeTurn(player, turn) {
  return { type: MAKE_TURN, player, turn }
}

export function selectLevel(level) {
  return { type: SELECT_LEVEL, level }
}