import expect from 'expect'
import * as gameLogic from '../logic/gameLogic'
import * as reducer from '../reducers/game'
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

describe('game logic', () => {
  it('should allow one selected stones to be moved', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 4, 4)
    ]
    var state = {
      selectedStones: selectedStones,
      field: createFieldWithStones(selectedStones)
    }
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(true)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(true)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(true)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(true)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(false)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(false)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(false)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(true)
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
    expect(gameLogic.stonesBuildAMovableFigure(state)).toEqual(false)
  })


  it('should return the width of one selected stone', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3)
    ]
    var expectedWidth = 0
    expect(gameLogic.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of one selected stone', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3)
    ]
    var expectedWidth = 0
    expect(gameLogic.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the width of two horizontal selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3)
    ]
    var expectedWidth = 1
    expect(gameLogic.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of two horizontal selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3)
    ]
    var expectedWidth = 0
    expect(gameLogic.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the width of two vertical selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 3, 4)
    ]
    var expectedWidth = 0
    expect(gameLogic.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of two vertical selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 3, 4)
    ]
    var expectedWidth = 1
    expect(gameLogic.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })

  it('should return the width of two sperate selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 7, 6)
    ]
    var expectedWidth = 4
    expect(gameLogic.getWidthOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })
  it('should return the height of two seperate selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 7, 6)
    ]
    var expectedWidth = 3
    expect(gameLogic.getHeightOfSelectedStones(selectedStones)).toEqual(expectedWidth)
  })



  it('should return the top left stone of one selected stone', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3)
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(gameLogic.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })
  it('should return the top left stone of two horizontal selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3)
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(gameLogic.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })
  it('should return the top left stone of two vertical selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 3, 4)
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(gameLogic.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })
  it('should return the top left stone of a block of selected stones', () => {
    var selectedStones = [
      createStone(types.Player.WHITE, 3, 3),
      createStone(types.Player.WHITE, 4, 3),
      createStone(types.Player.WHITE, 3, 4),
      createStone(types.Player.WHITE, 4, 4),
    ]
    var expectedStone = createStone(types.Player.WHITE, 3, 3)
    expect(gameLogic.getTopLeftStoneOfSelectedStones(selectedStones)).toEqual(expectedStone)
  })



  it('should return that row 0 is not in court', () => {
    expect(gameLogic.rowIsInCourt(0)).toEqual(false)
  })
  it('should return that row 1 is in court', () => {
    expect(gameLogic.rowIsInCourt(1)).toEqual(true)
  })
  it('should return that row 8 is in court', () => {
    expect(gameLogic.rowIsInCourt(8)).toEqual(true)
  })
  it('should return that row 9 is not in court', () => {
    expect(gameLogic.rowIsInCourt(9)).toEqual(false)
  })

  it('should return that col 0 is not in court', () => {
    expect(gameLogic.colIsInCourt(0)).toEqual(false)
  })
  it('should return that col 1 is in court', () => {
    expect(gameLogic.colIsInCourt(1)).toEqual(true)
  })
  it('should return that col 8 is in court', () => {
    expect(gameLogic.colIsInCourt(8)).toEqual(true)
  })
  it('should return that col 9 is not in court', () => {
    expect(gameLogic.colIsInCourt(9)).toEqual(false)
  })

  it('should return that col 0 is not in core', () => {
    expect(gameLogic.colIsInCore(0)).toEqual(false)
  })
  it('should return that col 2 is not in core', () => {
    expect(gameLogic.colIsInCore(2)).toEqual(false)
  })
  it('should return that col 3 is in core', () => {
    expect(gameLogic.colIsInCore(3)).toEqual(true)
  })
  it('should return that col 6 is in core', () => {
    expect(gameLogic.colIsInCore(6)).toEqual(true)
  })
  it('should return that col 7 is not in core', () => {
    expect(gameLogic.colIsInCore(7)).toEqual(false)
  })
  it('should return that col 9 is not in core', () => {
    expect(gameLogic.colIsInCore(9)).toEqual(false)
  })

  it('should return that row 0 is not in core', () => {
    expect(gameLogic.rowIsInCore(0)).toEqual(false)
  })
  it('should return that row 2 is not in core', () => {
    expect(gameLogic.rowIsInCore(2)).toEqual(false)
  })
  it('should return that row 3 is in core', () => {
    expect(gameLogic.rowIsInCore(3)).toEqual(true)
  })
  it('should return that row 6 is in core', () => {
    expect(gameLogic.rowIsInCore(6)).toEqual(true)
  })
  it('should return that row 7 is not in core', () => {
    expect(gameLogic.rowIsInCore(7)).toEqual(false)
  })
  it('should return that row 9 is not in core', () => {
    expect(gameLogic.rowIsInCore(9)).toEqual(false)
  })


  it('should return that stones are next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    expect(gameLogic.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(true)
  })
  it('should return that stones are next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 0, 1)
    expect(gameLogic.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(true)
  })
  it('should return that stones are next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 5, 4)
    var stoneB = createStone(types.Player.WHITE, 6, 4)
    expect(gameLogic.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(true)
  })
  it('should return that stones are not next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 1)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    expect(gameLogic.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(false)
  })
  it('should return that stones are not next to each other', () => {
    var stoneA = createStone(types.Player.WHITE, 2, 3)
    var stoneB = createStone(types.Player.WHITE, 7, 6)
    expect(gameLogic.stonesAreNextToEachOther(stoneA, stoneB)).toEqual(false)
  })


  it('should return that stones is next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 1, 0)
    var state = {
      stones: [stoneA]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(true)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 1, 0)
    var state = {
      stones: [stoneA]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.WHITE, 0, 1)
    var state = {
      stones: [stoneA]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(true)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var stoneB = createStone(types.Player.BLACK, 0, 1)
    var state = {
      stones: [stoneA]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.BLACK, 5, 0)
    var stoneC = createStone(types.Player.BLACK, 6, 0)
    var state = {
      stones: [stoneA, stoneC]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(true)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.BLACK, 5, 0)
    var stoneC = createStone(types.Player.WHITE, 6, 0)
    var state = {
      stones: [stoneA, stoneC]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.BLACK, 7, 1)
    var state = {
      stones: [stoneA]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
  })
  it('should return that stone is not next to the same color', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 7, 1)
    var state = {
      stones: [stoneA]
    }
    expect(gameLogic.stoneIsNextToSameColor(state, stoneB)).toEqual(false)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(true)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(true)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(true)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(true)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(true)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(false)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(false)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(false)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(false)
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
    expect(gameLogic.positionIsAllowed(state, stoneB)).toEqual(false)
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
    expect(gameLogic.getPossibleTurnsDiagonal(state)).toEqual(expectedField)
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
    expect(gameLogic.getPossibleTurnsDiagonal(state)).toEqual(expectedField)
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
    expect(gameLogic.getPossibleTurnsDiagonal(state)).toEqual(expectedField)
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
    expect(gameLogic.getPossibleTurnsDiagonal(state)).toEqual(expectedField)
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
    expect(gameLogic.getPossibleTurnsDiagonal(state)).toEqual(expectedField)
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
    expect(gameLogic.getPossibleTurnsDiagonal(state)).toEqual(expectedField)
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
    expect(gameLogic.getPossibleTurnsDiagonal(state)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=1;i<10;i++){
      expectedField[stoneA.position.col][i] = 1
    }
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<10;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<10;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 2,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<9;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 2,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<stoneA.position.row;i++){
      expectedField[stoneA.position.col][i] = 1
    }
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 2,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<9;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 2,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 2,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<8;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
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
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneB,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    expect(gameLogic.getPossibleTurnsVertical(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
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
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 5, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA, stoneB],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 2,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<9;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 4)
    var stoneB = createStone(types.Player.WHITE, 5, 4)
    var stoneC = createStone(types.Player.GOLD, 6, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 2,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<stoneA.position.col;i++){
      expectedField[i][stoneA.position.row] = 1
    }
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 3)
    var stoneB = createStone(types.Player.WHITE, 1, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA, stoneB],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 2,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<9;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 3)
    var stoneB = createStone(types.Player.WHITE, 1, 3)
    var stoneC = createStone(types.Player.WHITE, 2, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 2,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 3)
    var stoneB = createStone(types.Player.WHITE, 1, 3)
    var stoneC = createStone(types.Player.BLACK, 2, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 2,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    for(var i=0;i<8;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 3)
    var stoneB = createStone(types.Player.WHITE, 1, 3)
    var stoneC = createStone(types.Player.BLACK, 2, 3)
    var stoneD = createStone(types.Player.BLACK, 3, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC, stoneD]),
      stones: [stoneA, stoneB, stoneC, stoneD],
      selectedStones: [stoneA, stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 2,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })
  it('should return all possible horizontal turns for stone', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 3)
    var stoneB = createStone(types.Player.WHITE, 1, 3)
    var stoneC = createStone(types.Player.BLACK, 2, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneB],
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var selectedStonesInfo = {
      width: 1,
      height: 1,
      topLeftStone: stoneA,
      colorOpp: types.Player.BLACK
    }
    var expectedField = createFieldWithStones([])
    expect(gameLogic.getPossibleTurnsHorizontal(state, selectedStonesInfo)).toEqual(expectedField)
  })


  it('should return all possible turns for stone', () => {
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
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    for(var i=0;i<10;i++){
      if(i != stoneA.position.row){
        expectedField[stoneA.position.col][i] = 1
      }
    }
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][i] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    for(var i=0;i<10;i++){
      if(i != stoneA.position.col){
        expectedField[i][stoneA.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })
  it('should return all possible turns for stone', () => {
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
    for(var i=0;i<10;i++){
      if(i != stoneB.position.col){
        expectedField[i][stoneB.position.row] = 1
      }
    }
    expect(gameLogic.getPossibleTurnsForSelectedStones(state)).toEqual(expectedField)
  })


  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var action = {
      position: {
        col: 2,
        row: 0
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStone = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedField = createFieldWithStones([expectedStone])
    expectedState.field = expectedField
    expectedState.stones = [expectedStone]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 0, 0)
    var action = {
      position: {
        col: 4,
        row: 4
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStone = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedField = createFieldWithStones([expectedStone])
    expectedState.field = expectedField
    expectedState.stones = [expectedStone]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.GOLD, 5, 5)
    var action = {
      position: {
        col: 2,
        row: 0
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA, stoneB],
      selectedStones: [stoneA],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStoneA = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedStoneB = createStone(types.Player.GOLD, stoneB.position.col, stoneB.position.row)

    var expectedField = createFieldWithStones([expectedStoneA, expectedStoneB])
    expectedState.field = expectedField
    expectedState.stones = [expectedStoneA, expectedStoneB]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should not set the turn and clear the selected stones', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var action = {
      position: {
        col: 2,
        row: 1
      }
    }
    var possibleTurns = createFieldWithStones([])
    var state = {
      field: createFieldWithStones([stoneA]),
      stones: [stoneA],
      selectedStones: [stoneA],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedStone = createStone(types.Player.WHITE, 4, 0)
    var expectedField = createFieldWithStones([expectedStone])
    expectedState.field = expectedField
    expectedState.stones = [expectedStone]
    expectedState.selectedStones = []
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 1)
    var action = {
      position: {
        col: 4,
        row: 4
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA, stoneB]),
      stones: [stoneA, stoneB],
      selectedStones: [stoneA, stoneB],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStoneA = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedStoneB = createStone(types.Player.WHITE, action.position.col, action.position.row + 1)
    var expectedField = createFieldWithStones([expectedStoneA, expectedStoneB])
    expectedState.field = expectedField
    expectedState.stones = [expectedStoneA, expectedStoneB]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 1)
    var stoneC = createStone(types.Player.BLACK, 4, 2)
    var action = {
      position: {
        col: 4,
        row: 4
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStoneA = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedStoneB = createStone(types.Player.WHITE, action.position.col, action.position.row + 1)
    var expectedStoneC = createStone(types.Player.BLACK, action.position.col, action.position.row + 2)
    var expectedField = createFieldWithStones([expectedStoneA, expectedStoneB, expectedStoneC])
    expectedState.field = expectedField
    expectedState.stones = [expectedStoneA, expectedStoneB, expectedStoneC]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 5)
    var stoneB = createStone(types.Player.WHITE, 4, 6)
    var stoneC = createStone(types.Player.BLACK, 4, 4)
    var action = {
      position: {
        col: 4,
        row: 4
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStoneA = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedStoneB = createStone(types.Player.WHITE, action.position.col, action.position.row + 1)
    var expectedStoneC = createStone(types.Player.BLACK, action.position.col, action.position.row - 1)
    var expectedField = createFieldWithStones([expectedStoneA, expectedStoneB, expectedStoneC])
    expectedState.field = expectedField
    expectedState.stones = [expectedStoneA, expectedStoneB, expectedStoneC]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 4, 1)
    var stoneC = createStone(types.Player.WHITE, 5, 0)
    var stoneD = createStone(types.Player.WHITE, 5, 1)
    var stoneE = createStone(types.Player.BLACK, 4, 2)
    var action = {
      position: {
        col: 4,
        row: 4
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC, stoneD, stoneE]),
      stones: [stoneA, stoneB, stoneC, stoneD, stoneE],
      selectedStones: [stoneA, stoneB, stoneC, stoneD],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStoneA = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedStoneB = createStone(types.Player.WHITE, action.position.col, action.position.row + 1)
    var expectedStoneC = createStone(types.Player.WHITE, action.position.col + 1, action.position.row)
    var expectedStoneD = createStone(types.Player.WHITE, action.position.col + 1, action.position.row + 1)
    var expectedStoneE = createStone(types.Player.BLACK, action.position.col, action.position.row + 2)
    var expectedField = createFieldWithStones([expectedStoneA, expectedStoneB, expectedStoneC, expectedStoneD, expectedStoneE])
    expectedState.field = expectedField
    expectedState.stones = [expectedStoneA, expectedStoneB, expectedStoneC, expectedStoneD, expectedStoneE]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 3, 0)
    var stoneC = createStone(types.Player.BLACK, 2, 0)
    var action = {
      position: {
        col: 1,
        row: 0
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStoneA = createStone(types.Player.WHITE, action.position.col + 1, action.position.row)
    var expectedStoneB = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedStoneC = createStone(types.Player.BLACK, action.position.col - 1, action.position.row)
    var expectedField = createFieldWithStones([expectedStoneA, expectedStoneB, expectedStoneC])
    expectedState.field = expectedField
    expectedState.stones = [expectedStoneA, expectedStoneB, expectedStoneC]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should set the turn and return the new state', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 0)
    var stoneB = createStone(types.Player.WHITE, 3, 0)
    var stoneC = createStone(types.Player.BLACK, 5, 0)
    var action = {
      position: {
        col: 6,
        row: 0
      }
    }
    var possibleTurns = createFieldWithStones([])
    possibleTurns[action.position.col][action.position.row] = 1
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [stoneA, stoneB],
      possibleTurns: possibleTurns,
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var expectedState = {
      field: [],
      stones: [],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        activePlayer: types.Player.BLACK,
        state: types.GameStates.BLACK_PLAYER_MAKE_TURN
      }
    }
    var expectedStoneA = createStone(types.Player.WHITE, action.position.col + 1, action.position.row)
    var expectedStoneB = createStone(types.Player.WHITE, action.position.col, action.position.row)
    var expectedStoneC = createStone(types.Player.BLACK, action.position.col + 2, action.position.row)
    var expectedField = createFieldWithStones([expectedStoneA, expectedStoneB, expectedStoneC])
    expectedState.field = expectedField
    expectedState.stones = [expectedStoneA, expectedStoneB, expectedStoneC]
    expect(reducer.makeTurn(state, action)).toEqual(expectedState)
  })
  it('should return that figure turm3 is on field', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 5, 3)
    var stoneC = createStone(types.Player.WHITE, 6, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[0]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles)).toEqual(true)
  })
  it('should return that figure turm3 is not on field', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 5, 3)
    var stoneC = createStone(types.Player.WHITE, 7, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[0]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles)).toEqual(false)
  })
  it('should return that figure turm3 is on field', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 4)
    var stoneB = createStone(types.Player.WHITE, 3, 5)
    var stoneC = createStone(types.Player.WHITE, 3, 6)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[0]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles90)).toEqual(true)
  })
  it('should return that figure turm3 is not on field', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 4)
    var stoneB = createStone(types.Player.WHITE, 3, 5)
    var stoneC = createStone(types.Player.WHITE, 3, 7)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[0]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles90)).toEqual(false)
  })
  it('should return that figure treppe3 is on field', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 6)
    var stoneB = createStone(types.Player.WHITE, 5, 5)
    var stoneC = createStone(types.Player.WHITE, 6, 4)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[1]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles)).toEqual(true)
  })
  it('should return that figure treppe3 is not on field', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 5, 4)
    var stoneC = createStone(types.Player.WHITE, 7, 5)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[1]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles)).toEqual(false)
  })
  it('should return that figure treppe3 is on field', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 4)
    var stoneB = createStone(types.Player.WHITE, 4, 5)
    var stoneC = createStone(types.Player.WHITE, 5, 6)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[1]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles90)).toEqual(true)
  })
  it('should return that figure treppe3 is not on field', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 4)
    var stoneB = createStone(types.Player.WHITE, 4, 5)
    var stoneC = createStone(types.Player.WHITE, 4, 6)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[1]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles90)).toEqual(false)
  })
  it('should return that figure bluete is on field', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 2)
    var stoneB = createStone(types.Player.WHITE, 3, 4)
    var stoneC = createStone(types.Player.WHITE, 2, 3)
    var stoneD = createStone(types.Player.WHITE, 4, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC, stoneD]),
      stones: [stoneA, stoneB, stoneC, stoneD],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[4]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles)).toEqual(true)
  })
  it('should return that figure bluete is not on field', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 2)
    var stoneB = createStone(types.Player.WHITE, 3, 4)
    var stoneC = createStone(types.Player.WHITE, 2, 3)
    var stoneD = createStone(types.Player.WHITE, 4, 3)
    var stoneE = createStone(types.Player.WHITE, 3, 3)
    var state = {
      field: createFieldWithStones([stoneA, stoneB, stoneC, stoneD, stoneE]),
      stones: [stoneA, stoneB, stoneC, stoneD, stoneE],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    var level = levels[4]
    expect(gameLogic.figureIsOnField(state, types.Player.WHITE, level.tiles)).toEqual(false)
  })
  it('should return that player has won', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 5, 3)
    var stoneC = createStone(types.Player.WHITE, 6, 3)
    var state = {
      level: levels[0],
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    expect(gameLogic.playerHasWon(state, types.Player.WHITE)).toEqual(true)
  })
  it('should return that player has not won', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 5, 3)
    var stoneC = createStone(types.Player.WHITE, 7, 3)
    var state = {
      level: levels[0],
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    expect(gameLogic.playerHasWon(state, types.Player.WHITE)).toEqual(false)
  })
  it('should return that player has not won', () => {
    var stoneA = createStone(types.Player.WHITE, 4, 3)
    var stoneB = createStone(types.Player.WHITE, 5, 3)
    var stoneC = createStone(types.Player.BLACK, 6, 3)
    var state = {
      level: levels[0],
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    expect(gameLogic.playerHasWon(state, types.Player.WHITE)).toEqual(false)
  })
  it('should return that player has won', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 4)
    var stoneB = createStone(types.Player.WHITE, 3, 5)
    var stoneC = createStone(types.Player.WHITE, 3, 6)
    var state = {
      level: levels[0],
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    expect(gameLogic.playerHasWon(state, types.Player.WHITE)).toEqual(true)
  })
  it('should return that player has not won', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 4)
    var stoneB = createStone(types.Player.WHITE, 3, 5)
    var stoneC = createStone(types.Player.WHITE, 3, 7)
    var state = {
      level: levels[0],
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    expect(gameLogic.playerHasWon(state, types.Player.WHITE)).toEqual(false)
  })
  it('should return that player has not won', () => {
    var stoneA = createStone(types.Player.WHITE, 3, 4)
    var stoneB = createStone(types.Player.WHITE, 3, 5)
    var stoneC = createStone(types.Player.BLACK, 3, 6)
    var state = {
      level: levels[0],
      field: createFieldWithStones([stoneA, stoneB, stoneC]),
      stones: [stoneA, stoneB, stoneC],
      selectedStones: [],
      possibleTurns: createFieldWithStones([]),
      gameState: {
        state: types.GameStates.WHITE_PLAYER_MAKE_TURN
      }
    }
    expect(gameLogic.playerHasWon(state, types.Player.WHITE)).toEqual(false)
  })
})