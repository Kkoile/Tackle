import { combineReducers } from 'redux'
import { 
    FIELD_CLICKED, 
    SELECT_LEVEL, 
    STONE_CLICKED, 
    SET_PLAY_MODE, 
    RESET_GAME,
    COMPUTERS_TURN,
    OPPONENTS_TURN,
    SET_OPPONENTS_TURN,
    NOTIFY_LEVEL_SELECTION,
    SET_PLAYER
  } from '../actions/game'
import { GameStates, Player, FIELD_SIZE } from '../constants/game'
import { levels } from '../constants/levels'
import * as PlayModes from '../constants/playModes'
import * as gameLogic from '../logic/gameLogic'
import * as computer from '../logic/artificialIntelligence'

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

/*tc*/export/*etc*/function setTurn(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState = gameLogic.setTurn(newState, action.position)
  newState.selectedStones = []
  newState.possibleTurns = createEmptyBoardMatrix()
  newState.gameState = switchGameState(newState)
  if(gameLogic.playerHasWon(newState, Player.WHITE)) {
    newState.playerHasWon = Player.WHITE
  }
  if(gameLogic.playerHasWon(newState, Player.BLACK)) {
    newState.playerHasWon = Player.BLACK
  }
  return newState
}

/*tc*/export/*etc*/function clearSelectedStones(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState.selectedStones = []
  newState.possibleTurns = createEmptyBoardMatrix()
  return newState
}

/*tc*/export/*etc*/function makeTurn(state, action) {
  if(gameLogic.turnIsAllowed(state, action.position)){
    return setTurn(state, action)
  }else{
    return clearSelectedStones(state, action)
  }
  return state
}

/*tc*/export/*etc*/function createStone(state, player, position) {
  var id = 'stone' + state.stones.length
  return {
    id: id,
    player: player,
    position: position
  }
}

/*tc*/export/*etc*/function getColorFromRandomBoolean(isWhitePlayer) {
  if(isWhitePlayer) {
    return Player.WHITE
  }
  return Player.BLACK
}

/*tc*/export/*etc*/function getRandomColor() {
  var isWhitePlayer = Math.random()<.5
  return getColorFromRandomBoolean(isWhitePlayer)
}

/*tc*/export/*etc*/function stoneIsOnPossibleField(state, clickedStone) {
  return state.possibleTurns[clickedStone.position.col][clickedStone.position.row]
}

/*tc*/export/*etc*/function getStoneFromID(state, stoneID) {
  return state.stones.find((stone) => {
    return stone.id == stoneID
  })
}

/*tc*/export/*etc*/function userCanOnlySelectOwnColor(state) {
  return state.playMode == PlayModes.COMPUTER || 
          state.playMode == PlayModes.INTERNET
}

/*tc*/export/*etc*/function itIsTheBlackPlayersTurn(state) {
  return state.gameState.state == GameStates.BLACK_PLAYER_SET_STONE ||
          state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE ||
          state.gameState.state == GameStates.BLACK_PLAYER_MAKE_TURN 
}

/*tc*/export/*etc*/function itIsTheWhitePlayersTurn(state) {
  return state.gameState.state == GameStates.WHITE_PLAYER_SET_STONE ||
          state.gameState.state == GameStates.WHITE_PLAYER_MAKE_TURN
}

/*tc*/export/*etc*/function currentPlayer(state) {
  if(itIsTheWhitePlayersTurn(state)) {
    return Player.WHITE
  }
  if(itIsTheBlackPlayersTurn(state)) {
    return Player.BLACK
  }
}

/*tc*/export/*etc*/function itIsNotTheUsersTurn(state) {
  return currentPlayer(state) != state.ownColor
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
  var newState = JSON.parse(JSON.stringify(state))
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
  if(userCanOnlySelectOwnColor(state) && itIsNotTheUsersTurn(state)) {
    return state
  }
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

/*tc*/export/*etc*/function getStateAfterComputerHasSetStone(state) {
  var stone = computer.setStone(state)
  var newState = setStone(state, stone)
  if(newState.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE &&
      itIsNotTheUsersTurn(newState)) {
    var goldenStone = computer.setStone(newState)
    newState = setStone(newState, goldenStone)
  }
  return newState
}

/*tc*/export/*etc*/function getStateAfterComputerHasMadeTurn(state) {
  var move = computer.getNextMove(JSON.parse(JSON.stringify(state)))
  state.selectedStones = move.state.selectedStones
  var action = {
    position: move.position
  }
  var newState = setTurn(state, action)
  return newState
}

/*tc*/export/*etc*/function getStateAfterComputerMadeItsTurn(state) {
  if(state.playerHasWon) {
    return state
  }
  if(gameStateIsInStoneSetPhase(state)) {
    return getStateAfterComputerHasSetStone(state)
  }
  if(gameStateIsInMakeTurnPhase(state)) {
    return getStateAfterComputerHasMadeTurn(state)
  }
}

/*tc*/export/*etc*/function getInitialState() {
  return {
    playMode: PlayModes.NOT_SELECTED,
    level: {},
    ownColor: Player.WHITE,
    opponentColor: Player.BLACK,
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
  var newState = JSON.parse(JSON.stringify(state))
  var level = getLevelFromName(action.level)
  if(level) {
    newState.level = level
  }
  return newState
}

/*tc*/export/*etc*/function handleClickedOnField(state, action) {
  if(state.playerHasWon) {
    return state
  }
  if(gameStateIsInStoneSetPhase(state)){
    return handleSetStone(state, action)
  }
  if(gameStateIsInMakeTurnPhase(state)) {
    return makeTurn(state, action)
  }
  return newState
}

/*tc*/export/*etc*/function selectStone(state, clickedStone) {
  if(userCanOnlySelectOwnColor(state) && itIsNotTheUsersTurn(state)) {
    return state
  }
  var newState = JSON.parse(JSON.stringify(state))
  newState.selectedStones = gameLogic.changeSelectedStones(newState, clickedStone)
  newState.possibleTurns = gameLogic.getPossibleTurnsForSelectedStones(newState)
  return newState
}

/*tc*/export/*etc*/function handleClickedOnStone(state, action) {
  if(state.playerHasWon) {
    return state
  }
  if(gameStateIsInMakeTurnPhase(state)){
    var clickedStone = getStoneFromID(state, action.stoneID)
    if(stoneIsOnPossibleField(state, clickedStone)){
      return makeTurn(state, clickedStone)
    }else{
      return selectStone(state, clickedStone)
    }
  }
  return state
}

/*tc*/export/*etc*/function switchColor(color) {
  if(color == Player.WHITE){
    return Player.BLACK
  }else{
    return Player.WHITE
  }
}

/*tc*/export/*etc*/function handleSetPlayMode(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState.playMode = action.playMode
  switch (action.playMode) {
    case PlayModes.COMPUTER:
      newState.ownColor = getRandomColor()
      newState.opponentColor = switchColor(newState.ownColor)
      return newState
    case PlayModes.INTERNET:
      //TODO: Needs to be implemented depending on who started the match etc.
      newState.ownColor = Player.WHITE
      newState.opponentColor = Player.BLACK
      return newState
    default:
      //do nothing
  }
  return newState
}

/*tc*/export/*etc*/function handleSetPlayer(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  newState.ownColor = getColorFromRandomBoolean(action.isWhitePlayer)
  newState.opponentColor = switchColor(newState.ownColor)
  return newState
}

/*tc*/export/*etc*/function opponentIsComputer(state) {
  return state.playMode == PlayModes.COMPUTER
}

/*tc*/export/*etc*/function opponentIsInternet(state) {
  return state.playMode == PlayModes.INTERNET
}

/*tc*/export/*etc*/function handleComputersTurn(state, action) {
  if(opponentIsComputer(state) && itIsNotTheUsersTurn(state)) {
    return getStateAfterComputerMadeItsTurn(state)
  }
  return state
}

/*tc*/export/*etc*/function notifyOpponentOfLevelSelection(state, action) {
  if(opponentIsInternet(state) && !itIsNotTheUsersTurn(state)) {
    var socket = action.socket
    socket.emit('levelSelection', state.level.name)
  }
  return state
}

/*tc*/export/*etc*/function handleOpponentsTurn(state, action) {
  if(opponentIsInternet(state) && itIsNotTheUsersTurn(state)) {
    var socket = action.socket
    socket.emit('turn', state)
  }
  return state
}

/*tc*/export/*etc*/function setOpponentsTurn(state, action) {
  var newState = JSON.parse(JSON.stringify(state))
  if(opponentIsInternet(state) && itIsNotTheUsersTurn(state)) {
    var oppState = action.oppState
    newState.field = oppState.field
    newState.stones = oppState.stones
    newState.gameState = oppState.gameState
  }
  return newState
}

/*tc*/export/*etc*/function game(state = getInitialState(), action) {
  switch (action.type) {
    case SELECT_LEVEL:
      return handleSelectLevel(state, action)
    case FIELD_CLICKED:
      return handleClickedOnField(state, action)
    case STONE_CLICKED:
      return handleClickedOnStone(state, action)
    case SET_PLAY_MODE:
      return handleSetPlayMode(state, action)
    case SET_PLAYER:
      return handleSetPlayer(state, action)
    case RESET_GAME:
      return getInitialState()
    case COMPUTERS_TURN:
      return handleComputersTurn(state, action)
    case OPPONENTS_TURN:
      return handleOpponentsTurn(state, action)
    case SET_OPPONENTS_TURN:
      return setOpponentsTurn(state, action)
    case NOTIFY_LEVEL_SELECTION:
      return notifyOpponentOfLevelSelection(state, action)
    default:
      return state
  }
  return state
}

export default game