import expect from 'expect'
import * as actions from '../actions/game'
import reducer from '../reducers/game'
import * as types from '../constants/game'
import { levels } from '../constants/levels'

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
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(createInitialState())
  })
  it('should return a state with the selected level', () => {
    var state = createInitialState()
    var action = { type: actions.SELECT_LEVEL, level: levels[0].name }
    var expectedState = createInitialState()
    expectedState.level = levels[0]
    expect(reducer(state, action)).toEqual(expectedState)
  })
  it('should return the old state, because no level has been selected', () => {
    var state = createInitialState()
    var action = { type: actions.SELECT_LEVEL, level: undefined }
    var expectedState = createInitialState()
    expect(reducer(state, action)).toEqual(expectedState)
  })
  it('should return a state, which placed a white stone on the border of the field', () => {
    var state = createInitialState()
    state.level = levels[0]
    state.gameState.state = types.GameStates.WHITE_PLAYER_SET_STONE
    state.gameState.activePlayer = types.Player.WHITE
    var position = {
      col: 4,
      row: 0
    }
    var action = { 
      type: actions.FIELD_CLICKED, 
      player: types.Player.WHITE, 
      position: position 
    }
    var expectedState = createInitialState()
    expectedState.level = levels[0]
    expectedState.gameState.state = types.GameStates.BLACK_PLAYER_SET_STONE
    expectedState.gameState.activePlayer = types.Player.BLACK
    expectedState.field[position.col][position.row] = types.Player.WHITE
    expectedState.stones = [
      {
        id: 'stone0',
        player: types.Player.WHITE,
        position: position
      }
    ]
    expect(reducer(state, action)).toEqual(expectedState)
  })
  it('should return a state, which placed a black stone on the border of the field', () => {
    var state = createInitialState()
    state.level = levels[0]
    state.gameState.state = types.GameStates.BLACK_PLAYER_SET_STONE
    state.gameState.activePlayer = types.Player.BLACK
    var position = {
      col: 5,
      row: 0
    }
    var action = { 
      type: actions.FIELD_CLICKED, 
      player: types.Player.BLACK, 
      position: position 
    }
    state.stones = [
      {
        id: 'stone0',
        player: types.Player.WHITE,
        position: {
          col: 4,
          row: 0
        }
      }
    ]
    state.field[4][0] = types.Player.WHITE

    var expectedState = createInitialState()
    expectedState.level = levels[0]
    expectedState.gameState.state = types.GameStates.WHITE_PLAYER_SET_STONE
    expectedState.gameState.activePlayer = types.Player.WHITE
    expectedState.field[4][0] = types.Player.WHITE
    expectedState.field[position.col][position.row] = types.Player.BLACK
    expectedState.stones = [
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
        position: position
      }
    ]
    expect(reducer(state, action)).toEqual(expectedState)
  })
  it('should return the original state, because the field is already taken', () => {
    var state = createInitialState()
    state.level = levels[0]
    state.gameState.state = types.GameStates.BLACK_PLAYER_SET_STONE
    state.gameState.activePlayer = types.Player.BLACK
    var position = {
      col: 5,
      row: 0
    }
    var action = { 
      type: actions.FIELD_CLICKED, 
      player: types.Player.BLACK, 
      position: position 
    }
    state.stones = [
      {
        id: 'stone0',
        player: types.Player.WHITE,
        position: position
      }
    ]
    state.field[position.col][position.row] = types.Player.WHITE

    var expectedState = createInitialState()
    expectedState.level = levels[0]
    expectedState.gameState.state = types.GameStates.BLACK_PLAYER_SET_STONE
    expectedState.gameState.activePlayer = types.Player.BLACK
    expectedState.field[position.col][position.row] = types.Player.WHITE
    expectedState.stones = [
      {
        id: 'stone0',
        player: types.Player.WHITE,
        position: position
      }
    ]
    expect(reducer(state, action)).toEqual(expectedState)
  })
  it('should return the original state, because it is tried to set a stone next to the same color', () => {
    var state = createInitialState()
    state.level = levels[0]
    state.gameState.state = types.GameStates.WHITE_PLAYER_SET_STONE
    state.gameState.activePlayer = types.Player.WHITE
    var position = {
      col: 5,
      row: 0
    }
    var action = { 
      type: actions.FIELD_CLICKED, 
      player: types.Player.WHITE, 
      position: position 
    }
    state.stones = [
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
      }
    ]
    state.field[4][0] = types.Player.WHITE
    state.field[6][0] = types.Player.BLACK

    var expectedState = createInitialState()
    expectedState.level = levels[0]
    expectedState.gameState.state = types.GameStates.WHITE_PLAYER_SET_STONE
    expectedState.gameState.activePlayer = types.Player.WHITE
    expectedState.field[4][0] = types.Player.WHITE
    expectedState.field[6][0] = types.Player.BLACK
    expectedState.stones = [
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
      }
    ]
    expect(reducer(state, action)).toEqual(expectedState)
  })
  it('should return a state to set the golden stone', () => {
    var state = createInitialState()
    state.level = levels[0]
    state.gameState.state = types.GameStates.BLACK_PLAYER_SET_STONE
    state.gameState.activePlayer = types.Player.BLACK
    var position = {
      col: 2,
      row: 0
    }
    var action = { 
      type: actions.FIELD_CLICKED, 
      player: types.Player.BLACK, 
      position: position 
    }
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
      }
    ]
    state.stones = stones
    stones.map((stone) => {
      state.field[stone.position.col][stone.position.row] = stone.player
    })

    var expectedState = createInitialState()
    expectedState.level = levels[0]
    expectedState.gameState.state = types.GameStates.BLACK_PLAYER_SET_GOLDEN_STONE
    expectedState.gameState.activePlayer = types.Player.BLACK
    expectedState.stones = stones.slice()
    expectedState.stones.push({
      id: 'stone9',
      player: types.Player.BLACK,
      position: position
    })
    stones.map((stone) => {
      expectedState.field[stone.position.col][stone.position.row] = stone.player
    })
    expectedState.field[position.col][position.row] = types.Player.BLACK
    expect(reducer(state, action)).toEqual(expectedState)
  })

  it('should return a state with all possible turns and stone is selected', () => {
    var state = createNormalStateForGame()
    var action = { 
      type: actions.STONE_CLICKED, 
      stoneID: 'stone2'
    }

    var expectedState = createNormalStateForGame()
    expectedState.selectedStones = [
      {
        id: 'stone2',
        player: types.Player.WHITE,
        position: {
          col: 7,
          row: 0
        }
      }
    ]

    var expectedPossibleTurns = createFieldWithStones([])
    for(var i=1;i<10;i++) {
      expectedPossibleTurns[7][i] = 1
    }
    expectedState.possibleTurns = expectedPossibleTurns

    expect(reducer(state, action)).toEqual(expectedState)
  })
  it('should return a state with no possible turns and two stones are selected', () => {
    var state = createNormalStateForGame()
    var action = { 
      type: actions.STONE_CLICKED, 
      stoneID: 'stone4'
    }
    state.selectedStones = [
      {
        id: 'stone2',
        player: types.Player.WHITE,
        position: {
          col: 7,
          row: 0
        }
      }
    ]
    var possibleTurns = createFieldWithStones([])
    for(var i=1;i<10;i++) {
      possibleTurns[7][i] = 1
    }
    state.possibleTurns = possibleTurns

    var expectedState = createNormalStateForGame()
    expectedState.selectedStones = [
      {
        id: 'stone2',
        player: types.Player.WHITE,
        position: {
          col: 7,
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
      }
    ]
    expectedState.possibleTurns = createFieldWithStones([])
    expect(reducer(state, action)).toEqual(expectedState)
  })
})