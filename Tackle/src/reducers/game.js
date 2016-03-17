import { combineReducers } from 'redux'
import { FIELD_CLICKED, SET_GOLDEN_STONE, MAKE_TURN, SELECT_LEVEL, STONE_CLICKED } from '../actions/game'
import { GameStates, Player, FIELD_SIZE } from '../constants/game'
import { levels } from '../constants/levels'
import * as gameLogic from '../logic/gameLogic'

/*tc*/export/*etc*/function switchGameState(state) {
  var gameState = state.gameState
  switch (gameState.state){
    case GameStates.WHITE_PLAYER_SET_STONE:
      return {
        activePlayer: Player.BLACK,
        state: GameStates.BLACK_PLAYER_SET_STONE
      }
    case GameStates.BLACK_PLAYER_SET_STONE:
      if(thereAreNotEnoughStonesOnTheField(state)){
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
    case GameStates.WHITE_PLAYER_MAKE_TURN:
      return{
        activePlayer: Player.BLACK,
        state: GameStates.BLACK_PLAYER_MAKE_TURN
      }
    case GameStates.BLACK_PLAYER_MAKE_TURN:
      return{
        activePlayer: Player.WHITE,
        state: GameStates.WHITE_PLAYER_MAKE_TURN
      }
  }
}

/*tc*/export/*etc*/function makeTurn(state, action) {
  var newState = Object.assign({}, state)
  if(gameLogic.turnIsAllowed(state, action.position)){
    newState = gameLogic.setTurn(state, action.position)
    newState.selectedStones = []
    newState.possibleTurns = []
    newState.gameState = switchGameState(state)
  }
  return newState
}

/*tc*/export/*etc*/function createStone(state, player, position) {
  var id = 'stone' + state.stones.length
  return {
    id: id,
    player: player,
    position: position
  }
}

/*tc*/export/*etc*/function thereAreNotEnoughStonesOfPlayer(state, player) {
  var stones = state.stones.filter((stone) => {
    return stone.player == player
  })
  return stones.length < state.level.count + 2
}

/*tc*/export/*etc*/function thereAreNotEnoughStonesOnTheField(state) {
  return thereAreNotEnoughStonesOfPlayer(state, Player.WHITE) &&
          thereAreNotEnoughStonesOfPlayer(state, Player.BLACK)
}

/*tc*/export/*etc*/function setStone(state, action) {
  var newState = Object.assign({}, state)
  var { player, position } = action
  if(state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE){
    player = Player.GOLD
  }

  if(thereAreNotEnoughStonesOfPlayer(state) || 
      state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE) {
    newState.stones.push(createStone(state, player, position))
    newState.field[position.col][position.row] = player
    newState.gameState = switchGameState(state)
  }
  return newState
}

/*tc*/export/*etc*/function handleSetStone(state, action) {
  if(gameLogic.positionIsAllowed(state, action)){
    return setStone(state, action)
  }
  return state
}

/*tc*/export/*etc*/function gameStateIsInStoneSetPhase(state) {
  return state.gameState.state == GameStates.WHITE_PLAYER_SET_STONE ||
          state.gameState.state == GameStates.BLACK_PLAYER_SET_STONE ||
          state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE
}

/*tc*/export/*etc*/function gameStateIsInMakeTurnPhase(state) {
  return state.gameState.state == GameStates.WHITE_PLAYER_MAKE_TURN ||
          state.gameState.state == GameStates.BLACK_PLAYER_MAKE_TURN
}

/*tc*/export/*etc*/function getInitialState() {
  return {
    level: {},
    gameState: {
      state: GameStates.WHITE_PLAYER_SET_STONE,
      activePlayer: Player.WHITE
    },
    field: createEmptyBoardMatrix(),
    stones: [],
    selectedStones: [],
    possibleTurns: createEmptyBoardMatrix()
  }
}

/*tc*/export/*etc*/function createEmptyBoardMatrix() {
  var matrix = []
  for(var i=0;i<FIELD_SIZE;i++) {
    matrix.push(Array(FIELD_SIZE).fill(0))
  }
  return matrix
}

/*tc*/export/*etc*/function getLevelFromName(name) {
  var level = levels.filter((level) => {
    return level.name == name
  })
  return level[0]
}

/*tc*/export/*etc*/function handleSelectLevel(state, action) {
  var newState = Object.assign({}, state)
  var level = getLevelFromName(action.level)
  if(level) {
    newState.level = level
  }
  return newState
}

/*tc*/export/*etc*/function handleClickedOnField(state, action) {
  if(gameStateIsInStoneSetPhase(state)){
    return handleSetStone(state, action)
  }
  if(gameStateIsInMakeTurnPhase(state)) {
    return makeTurn(state, action)
  }
  return newState
}

/*tc*/export/*etc*/function handleClickedOnStone(state, action) {
  var newState = Object.assign({}, state)
  if(gameStateIsInMakeTurnPhase(state)){
    newState.selectedStones = gameLogic.changeSelectedStones(newState, action.stoneID)
    newState.possibleTurns = gameLogic.getPossibleTurnsForSelectedStones(newState)
  }
  return newState
}

/*tc*/export/*etc*/function stones(state = getInitialState(), action) {
  switch (action.type) {
    case SELECT_LEVEL:
      return handleSelectLevel(state, action)
    case FIELD_CLICKED:
      return handleClickedOnField(state, action)
    case STONE_CLICKED:
      return handleClickedOnStone(state, action)
    default:
      return state
  }
}

export default stones