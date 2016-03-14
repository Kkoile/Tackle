import { combineReducers } from 'redux'
import { SET_STONE, SET_GOLDEN_STONE, MAKE_TURN, SELECT_LEVEL } from '../actions/game'
import { GameStates, Player } from '../constants/game'
import { levels } from '../constants/levels'

function switchGameState(state) {
  var gameState = state.gameState
  switch (gameState.state){
    case GameStates.WHITE_PLAYER_SET_STONE:
      return {
        activePlayer: Player.BLACK,
        state: GameStates.BLACK_PLAYER_SET_STONE
      }
    case GameStates.BLACK_PLAYER_SET_STONE:
      if(state.stones.length/2<state.level.count+2){
        return {
          activePlayer: Player.WHITE,
          state: GameStates.WHITE_PLAYER_SET_STONE
        }
      }else{
        return {
          activePlayer: Player.BLACK,
          state: GameStates.BLACK_PLAYER_SET_GOLDEN_STONE
        }
      }
    case GameStates.BLACK_PLAYER_SET_GOLDEN_STONE:
      return{
        activePlayer: Player.WHITE,
        state: GameStates.WHITE_PLAYER_MAKE_TURN
      }
  }
}

function rowIsInCourt(row) {
  if(row>0 && row < 9){
    return true
  }
  return false
}

function colIsInCourt(col) {
  if(col>0 && col < 9){
    return true
  }
  return false
}

function rowIsInCore(row) {
  if(row>2 && row < 7){
    return true
  }
  return false
}

function colIsInCore(col) {
  if(col>2 && col < 7){
    return true
  }
  return false
}

function stonesAreNextToEachOther(stoneA, stoneB) {
  if(stoneA.row == stoneB.row){
    if(stoneA.col == stoneB.col+1 || stoneA.col == stoneB.col-1){
      return true
    }
  }
  if(stoneA.col == stoneB.col){
    if(stoneA.row == stoneB.row+1 || stoneA.row == stoneB.row-1){
      return true
    }
  }
  return false
}

function stoneIsNextToSameColor(state, action) {
  for(var i in state.stones){
    var stone = state.stones[i]
    if(stone.player == action.player){
      if(stonesAreNextToEachOther(stone.position, action.position)){
        return true
      }
    }
  }
  return false
}

function positionIsAllowed(state, action) {
  var {row, col} = action.position
  if(state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE){
    if(!(rowIsInCore(row) && colIsInCore(col))){
      return false
    }
  }else{
    if(rowIsInCourt(row) && colIsInCourt(col)){
      return false
    }
    if(stoneIsNextToSameColor(state, action)){
      return false
    }
  }
  return true
}

function getLevelFromName(name) {
  var level = levels.filter((level) => {
    return level.name == name
  })
  return level[0]
}

function initialState() {
  return {
    level: {},
    gameState: {
      state: GameStates.WHITE_PLAYER_SET_STONE,
      activePlayer: Player.WHITE
    },
    stones: []
  }
}

function stones(state = initialState(), action) {
  switch (action.type) {
    case SELECT_LEVEL:
      var newState = Object.assign({}, state)
      newState.level = getLevelFromName(action.level)
      return newState
    case SET_STONE:
      var newState = Object.assign({}, state)
      if(state.gameState.state == GameStates.WHITE_PLAYER_SET_STONE ||
        state.gameState.state == GameStates.BLACK_PLAYER_SET_STONE ||
        state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE){
        if(positionIsAllowed(state, action)){
          var player = action.player
          if(state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE){
            player = Player.GOLD
          }
          newState.stones.push(
            {
              id: 'stone' + state.stones.length,
              player: player,
              position: action.position
            })
          newState.gameState = switchGameState(state)
        }
      }
      return newState
    case MAKE_TURN:
      return state.map((stone, index) => {
        if (stone.id === action.id) {
          return Object.assign({}, stone, {
            position: action.position
          })
        }
        return stone
      })
    default:
      return state
  }
}

export default stones