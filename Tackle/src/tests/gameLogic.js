import expect from 'expect'
import * as reducer from '../reducers/game'
import * as types from '../constants/game'

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

describe('game logic', () => {
  it('should allow one selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4)
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(true)
  })
  it('should allow two vertical selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 4, 3)
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(true)
  })
  it('should allow two horizontal selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 3, 4)
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(true)
  })
  it('should allow a block of selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 3, 4),
      createStone(types.Player.WHITE, 4, 3),
      createStone(types.Player.WHITE, 3, 3)
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(true)
  })
  it('should not allow two seperate selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 0, 7)
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(false)
  })
  it('should not allow nearly a block of selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 3, 4),
      createStone(types.Player.WHITE, 3, 3)
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(false)
  })
  it('should not allow nearly a block of selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 3, 4),
      createStone(types.Player.WHITE, 3, 3)
    ]
    var stones = selectedStones.slice()
    stones.push(createStone(types.Player.WHITE, 4, 3))
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(stones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(false)
  })
  it('should allow a horizontal block of selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3),
      createStone(types.Player.WHITE, 5, 3),
      createStone(types.Player.WHITE, 3, 4),
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 5, 4),
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(true)
  })
  it('should not allow a horizontal block of with an extra stone selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3),
      createStone(types.Player.WHITE, 5, 3),
      createStone(types.Player.WHITE, 3, 4),
      createStone(types.Player.WHITE, 4, 4),
      createStone(types.Player.WHITE, 5, 4),
      createStone(types.Player.WHITE, 6, 3),
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(reducer.stonesBuildAMovableFigure(state)).toEqual(false)
  })


  it('should return the width of one selected stone', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3)
    ]
    var expectedWidth = 0
    expect(reducer.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of one selected stone', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3)
    ]
    var expectedWidth = 0
    expect(reducer.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the width of two horizontal selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3)
    ]
    var expectedWidth = 1
    expect(reducer.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of two horizontal selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3)
    ]
    var expectedWidth = 0
    expect(reducer.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the width of two vertical selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 3, 4)
    ]
    var expectedWidth = 0
    expect(reducer.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of two vertical selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 3, 4)
    ]
    var expectedWidth = 1
    expect(reducer.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })

  it('should return the width of two sperate selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 7, 6)
    ]
    var expectedWidth = 4
    expect(reducer.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of two seperate selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 7, 6)
    ]
    var expectedWidth = 3
    expect(reducer.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })



  it('should return the top left stone of one selected stone', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3)
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(reducer.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })
  it('should return the top left stone of two horizontal selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3)
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(reducer.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })
  it('should return the top left stone of two vertical selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 3, 4)
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(reducer.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })
  it('should return the top left stone of a block of selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3),
      createStone(types.Player.WHITE, 3, 4),
      createStone(types.Player.WHITE, 4, 4),
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(reducer.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })



  it('should return that row 0 is not in court', () => {
    expect(reducer.rowIsInCourt(0)).toEqual(false)
  })
  it('should return that row 1 is in court', () => {
    expect(reducer.rowIsInCourt(1)).toEqual(true)
  })
  it('should return that row 8 is in court', () => {
    expect(reducer.rowIsInCourt(8)).toEqual(true)
  })
  it('should return that row 9 is not in court', () => {
    expect(reducer.rowIsInCourt(9)).toEqual(false)
  })

  it('should return that col 0 is not in court', () => {
    expect(reducer.colIsInCourt(0)).toEqual(false)
  })
  it('should return that col 1 is in court', () => {
    expect(reducer.colIsInCourt(1)).toEqual(true)
  })
  it('should return that col 8 is in court', () => {
    expect(reducer.colIsInCourt(8)).toEqual(true)
  })
  it('should return that col 9 is not in court', () => {
    expect(reducer.colIsInCourt(9)).toEqual(false)
  })

  it('should return that col 0 is not in core', () => {
    expect(reducer.colIsInCore(0)).toEqual(false)
  })
  it('should return that col 2 is not in core', () => {
    expect(reducer.colIsInCore(2)).toEqual(false)
  })
  it('should return that col 3 is in core', () => {
    expect(reducer.colIsInCore(3)).toEqual(true)
  })
  it('should return that col 6 is in core', () => {
    expect(reducer.colIsInCore(6)).toEqual(true)
  })
  it('should return that col 7 is not in core', () => {
    expect(reducer.colIsInCore(7)).toEqual(false)
  })
  it('should return that col 9 is not in core', () => {
    expect(reducer.colIsInCore(9)).toEqual(false)
  })

  it('should return that row 0 is not in core', () => {
    expect(reducer.rowIsInCore(0)).toEqual(false)
  })
  it('should return that row 2 is not in core', () => {
    expect(reducer.rowIsInCore(2)).toEqual(false)
  })
  it('should return that row 3 is in core', () => {
    expect(reducer.rowIsInCore(3)).toEqual(true)
  })
  it('should return that row 6 is in core', () => {
    expect(reducer.rowIsInCore(6)).toEqual(true)
  })
  it('should return that row 7 is not in core', () => {
    expect(reducer.rowIsInCore(7)).toEqual(false)
  })
  it('should return that row 9 is not in core', () => {
    expect(reducer.rowIsInCore(9)).toEqual(false)
  })


  it('should return that stones are next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    expect(reducer.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(true)
  })
  it('should return that stones are next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 0, 1)
    expect(reducer.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(true)
  })
  it('should return that stones are next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 5, 4)
    var stoneB = createStone(types.Player.WHITE, 6, 4)
    expect(reducer.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(true)
  })
  it('should return that stones are not next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 1)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    expect(reducer.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(false)
  })
  it('should return that stones are not next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 2, 3)
    var stoneB = createStone(types.Player.WHITE, 7, 6)
    expect(reducer.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(false)
  })


  it('should return that stones is next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    var state = {
      stones: [stoneA]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(true)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 1, 0)
    var state = {
      stones: [stoneA]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 0, 1)
    var state = {
      stones: [stoneA]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(true)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 0, 1)
    var state = {
      stones: [stoneA]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.BLACK, 5, 0)
    var stoneC = createStone(types.Player.BLACK, 6, 0)
    var state = {
      stones: [stoneA, stoneC]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(true)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.BLACK, 5, 0)
    var stoneC = createStone(types.Player.WHITE, 6, 0)
    var state = {
      stones: [stoneA, stoneC]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.BLACK, 7, 1)
    var state = {
      stones: [stoneA]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 7, 1)
    var state = {
      stones: [stoneA]
    }
    expect(reducer.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })



  it('should return that the position is allowed', () => {
    var stoneA = createStone(types.Player.BLACK, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(true)
  })
  it('should return that the position is allowed', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(true)
  })
  it('should return that the position is allowed', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 1, 0)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.BLACK_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(true)
  })
  it('should return that the position is allowed', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 0)
    var stoneB = createStone(types.Player.BLACK, 1, 0)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.BLACK_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(true)
  })
  it('should return that the position is allowed', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 0)
    var stoneB = createStone(types.Player.BLACK, 5, 5)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.BLACK_PLAYER_SET_GOLDEN_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(true)
  })
  it('should return that the position is not allowed', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(false)
  })
  it('should return that the position is not allowed', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 3, 4)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(false)
  })
  it('should return that the position is not allowed', () => {
    var stoneA = createStone(types.Player.BLACK, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 1, 0)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.BLACK_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(false)
  })
  it('should return that the position is not allowed', () => {
    var stoneA = createStone(types.Player.BLACK, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 3, 4)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.BLACK_PLAYER_SET_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(false)
  })
  it('should return that the position is not allowed', () => {
    var stoneA = createStone(types.Player.BLACK, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 3, 2)
    var state = {
      stones: [stoneA],
      gameState: {
        state: types.GameStates.BLACK_PLAYER_SET_GOLDEN_STONE
      }
    }
    expect(reducer.positionIsAllowed(state, stoneB)).toEqual(false)
  })



  it('should return all possible diagonal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<state.field.length;i++){
      expectedField[i][i] = 1
    }
    expect(reducer.possibleTurnsDiagonal(state)).toEqual(expectedField)
  })
  it('should return all possible diagonal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.GOLD, 4, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<stoneB.position.col;i++){
      expectedField[i][i] = 1
    }
    expect(reducer.possibleTurnsDiagonal(state)).toEqual(expectedField)
  })
  it('should return all possible diagonal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<stoneB.position.col;i++){
      expectedField[i][i] = 1
    }
    expect(reducer.possibleTurnsDiagonal(state)).toEqual(expectedField)
  })
  it('should return all possible diagonal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 4, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<stoneB.position.col;i++){
      expectedField[i][i] = 1
    }
    expect(reducer.possibleTurnsDiagonal(state)).toEqual(expectedField)
  })
  it('should return all possible diagonal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 9, 9)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<stoneB.position.col;i++){
      expectedField[i][i] = 1
    }
    expect(reducer.possibleTurnsDiagonal(state)).toEqual(expectedField)
  })
  it('should return all possible diagonal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 1)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<stoneB.position.col;i++){
      expectedField[i][i] = 1
    }
    expect(reducer.possibleTurnsDiagonal(state)).toEqual(expectedField)
  })
  it('should return all possible diagonal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 9, 0)
    var stoneB = createStone(types.Player.GOLD, 5, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=8;i>stoneB.position.col;i--){
      expectedField[i][9-i] = 1
    }
    expect(reducer.possibleTurnsDiagonal(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<10;i++){
      expectedField[stoneA.position.col][i] = 1
    }
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<10;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.GOLD, 5, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<10;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 4, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA, stoneB],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<9;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 4, 4)
    var stoneC = createStone(types.Player.GOLD, 4, 5)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<stoneA.position.row;i++){
      expectedField[stoneA.position.col][i] = 1
    }
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 1)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA, stoneB],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<9;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 1)
    var stoneC = createStone(types.Player.WHITE, 4, 2)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 1)
    var stoneC = createStone(types.Player.BLACK, 4, 2)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<8;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
  it('should return all possible vertical turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 1)
    var stoneC = createStone(types.Player.BLACK, 4, 2)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedField = createFieldWithStones([])
    expect(reducer.possibleTurnsVertical(state)).toEqual(expectedField)
  })
})