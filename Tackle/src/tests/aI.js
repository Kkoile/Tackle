import expect from 'expect'
import * as aI from '../logic/artificialIntelligence'
import * as types from '../constants/game'
import { levels } from '../constants/levels'
import * as PlayModes from '../constants/playModes'
/*tc*/export/*etc*/function createFieldWithStones (stones) {
  var field = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ]
  stones.map((stone) => {
    field[stone.position.col][stone.position.row] = stone.player
  })
  return field
}

function createStone (player, col, row) {
  return {
    player: player,
    position: {
      col: col,
      row: row
    }
  }
}

function createNormalStateForGame () {
  var state = createInitialState()
  state.level = levels[0]
  state.gameState.state = types.GameStates.WHITE_PLAYER_MAKE_TURN
  state.gameState.activePlayer = types.Player.WHITE
  var stones = [
    {
      id: 'stone0',
      player: types.Player.WHITE,
      position: {
        col: 4,
        row: 0
      }
    },
    {
      id: 'stone1',
      player: types.Player.BLACK,
      position: {
        col: 6,
        row: 0
      }
    },
    {
      id: 'stone2',
      player: types.Player.WHITE,
      position: {
        col: 7,
        row: 0
      }
    },
    {
      id: 'stone3',
      player: types.Player.BLACK,
      position: {
        col: 8,
        row: 0
      }
    },
    {
      id: 'stone4',
      player: types.Player.WHITE,
      position: {
        col: 9,
        row: 0
      }
    },
    {
      id: 'stone5',
      player: types.Player.BLACK,
      position: {
        col: 9,
        row: 1
      }
    },
    {
      id: 'stone6',
      player: types.Player.WHITE,
      position: {
        col: 9,
        row: 2
      }
    },
    {
      id: 'stone7',
      player: types.Player.BLACK,
      position: {
        col: 9,
        row: 3
      }
    },
    {
      id: 'stone8',
      player: types.Player.WHITE,
      position: {
        col: 9,
        row: 4
      }
    },
    {
      id: 'stone9',
      player: types.Player.BLACK,
      position: {
        col: 9,
        row: 5
      }
    },
    {
      id: 'stone10',
      player: types.Player.GOLD,
      position: {
        col: 5,
        row: 5
      }
    }
  ]
  state.stones = stones
  stones.map((stone) => {
    state.field[stone.position.col][stone.position.row] = stone.player
  })
  return state
}

function createInitialState () {
  return {
    playMode: PlayModes.NOT_SELECTED,
    ownColor: types.Player.WHITE,
    opponentColor: types.Player.BLACK,
    level: {},
    gameState: {
      state: types.GameStates.WHITE_PLAYER_SET_STONE,
      activePlayer: types.Player.WHITE
    },
    field: createFieldWithStones([]),
    stones: [],
    selectedStones: [],
    possibleTurns: createFieldWithStones([])
  }
}

describe('game reducer', () => {
  it('should join the moves', () => {
    var state = createNormalStateForGame()
    var moves = []
    var selectedStones = [state.stones[1]]
    var possibleTurns = createFieldWithStones([])
    possibleTurns[0][1] = 1

    var newState = Object.assign({}, state)
    newState.selectedStones = selectedStones.slice()
    newState.possibleTurns = possibleTurns.slice()

    var newMove = {
        state: newState,
        position: {
            col: 0,
            row: 1
        }
    }
    var expectedMoves = [newMove]

    expect(
      aI.addPossibleTurns(moves, state, selectedStones, possibleTurns)
    ).toEqual(expectedMoves)
  })
  it('should return all possible moves of the computer', () => {
    var state = createInitialState()
    var stones = [
      createStone(types.Player.WHITE, 0, 0),
      createStone(types.Player.BLACK, 0, 1)
    ]
    state.gameState.state = types.GameStates.BLACK_PLAYER_MAKE_TURN
    state.gameState.activePlayer = types.Player.BLACK
    state.field = createFieldWithStones(stones)
    state.stones = stones.slice()
    state.selectedStones = [stones[1]]

    var possibleTurns = createFieldWithStones([])
    for(var i=1;i<10;i++){
      possibleTurns[i][1] = 1
    }
    for(var i=2;i<10;i++){
      possibleTurns[0][i] = 1
    }

    var expectedMoves = []

    possibleTurns.map((col, i) => {
      col.map((field, j) => {
        if(field > 0) {
          var newState = Object.assign({}, state)
          newState.possibleTurns = possibleTurns.slice()
          newState.selectedStones = state.selectedStones.slice()
          expectedMoves.push({
              state: newState,
              position: {
                  col: i,
                  row: j
              }
          })
        }
      })
    })

    expect(
      aI.generateMoves(state, types.Player.BLACK)
    ).toEqual(expectedMoves)
  })
  it('should return all possible moves of the computer', () => {
    var state = createInitialState()
    var stones = [
      createStone(types.Player.WHITE, 0, 0),
      createStone(types.Player.BLACK, 0, 1),
      createStone(types.Player.BLACK, 1, 1)
    ]
    state.gameState.state = types.GameStates.BLACK_PLAYER_MAKE_TURN
    state.gameState.activePlayer = types.Player.BLACK
    state.field = createFieldWithStones(stones)
    state.stones = stones.slice()

    var expectedMoves = []

    var possibleTurns = createFieldWithStones([])
    for(var i=2;i<10;i++){
      possibleTurns[0][i] = 1
    }

    possibleTurns.map((col, i) => {
      col.map((field, j) => {
        if(field > 0) {
          var newState = Object.assign({}, state)
          newState.possibleTurns = possibleTurns.slice()
          newState.selectedStones = [createStone(types.Player.BLACK, 0, 1)]
          expectedMoves.push({
              state: newState,
              position: {
                  col: i,
                  row: j
              }
          })
        }
      })
    })

    possibleTurns = createFieldWithStones([])
    for(var i=1;i<9;i++){
      possibleTurns[i][1] = 1
    }

    possibleTurns.map((col, i) => {
      col.map((field, j) => {
        if(field > 0) {
          var newState = Object.assign({}, state)
          newState.possibleTurns = possibleTurns.slice()
          newState.selectedStones = [
            createStone(types.Player.BLACK, 0, 1), 
            createStone(types.Player.BLACK, 1, 1)
          ]
          expectedMoves.push({
              state: newState,
              position: {
                  col: i,
                  row: j
              }
          })
        }
      })
    })

    possibleTurns = createFieldWithStones([])
    for(var i=2;i<10;i++){
      possibleTurns[i][1] = 1
    }
    for(var i=0;i<10;i++){
      if(i!=1){
        possibleTurns[1][i] = 1
      }
    }

    possibleTurns.map((col, i) => {
      col.map((field, j) => {
        if(field > 0) {
          var newState = Object.assign({}, state)
          newState.possibleTurns = possibleTurns.slice()
          newState.selectedStones = [
            createStone(types.Player.BLACK, 1, 1)
          ]
          expectedMoves.push({
              state: newState,
              position: {
                  col: i,
                  row: j
              }
          })
        }
      })
    })

    expect(
      aI.generateMoves(state, types.Player.BLACK)
    ).toEqual(expectedMoves)
  })
  it('should return the best move of the computer', () => {
    var state = createNormalStateForGame()
    var stones = [
      createStone(types.Player.WHITE, 0, 0),
      createStone(types.Player.BLACK, 0, 1)
    ]
    state.gameState.state = types.GameStates.BLACK_PLAYER_MAKE_TURN
    state.gameState.activePlayer = types.Player.BLACK
    state.field = createFieldWithStones(stones)
    state.stones = stones.slice()

    var bestMove = aI.getNextMove(state)
    /*console.log(bestMove.state.field)
    console.log(bestMove.state.selectedStones)
    console.log(bestMove.position)*/
  })
})