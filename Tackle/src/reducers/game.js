import { combineReducers } from 'redux'
import { SET_STONE, SET_GOLDEN_STONE, MAKE_TURN, SELECT_LEVEL, STONE_CLICKED } from '../actions/game'
import { GameStates, Player, SIZE } from '../constants/game'
import { levels } from '../constants/levels'

/*tc*/export/*etc*/function switchGameState(state) {
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

/*tc*/export/*etc*/function rowIsInCourt(row) {
  if(row>0 && row < 9){
    return true
  }
  return false
}

/*tc*/export/*etc*/function colIsInCourt(col) {
  if(col>0 && col < 9){
    return true
  }
  return false
}

/*tc*/export/*etc*/function rowIsInCore(row) {
  if(row>2 && row < 7){
    return true
  }
  return false
}

/*tc*/export/*etc*/function colIsInCore(col) {
  if(col>2 && col < 7){
    return true
  }
  return false
}

/*tc*/export/*etc*/function stonesAreNextToEachOther(stoneA, stoneB) {
  if(stoneA.position.row == stoneB.position.row) {
    if(stoneA.position.col == stoneB.position.col+1 || 
        stoneA.position.col == stoneB.position.col-1){
      return true
    }
  }
  if(stoneA.position.col == stoneB.position.col){
    if(stoneA.position.row == stoneB.position.row+1 || 
        stoneA.position.row == stoneB.position.row-1){
      return true
    }
  }
  return false
}

/*tc*/export/*etc*/function stoneIsNextToSameColor(state, action) {
  for(var i in state.stones){
    var stone = state.stones[i]
    if(stone.player == action.player){
      if(stonesAreNextToEachOther(stone, action)){
        return true
      }
    }
  }
  return false
}

/*tc*/export/*etc*/function positionIsAllowed(state, action) {
  var {row, col} = action.position
  var locationIsAlreadyTaken = false
  state.stones.map((stone) => {
    if(stone.position == action.position) {
      locationIsAlreadyTaken = true
    }
  })
  if(locationIsAlreadyTaken) {
    return false
  }
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

/*tc*/export/*etc*/function getLevelFromName(name) {
  var level = levels.filter((level) => {
    return level.name == name
  })
  return level[0]
}

/*tc*/export/*etc*/function getWidthOfSelectedStones(stones) {
  if(stones.length<1){
    return 0
  }
  var highestX = stones[0].position.col
  var lowestX = stones[0].position.col

  stones.map((stone) => {
    if(stone.position.col > highestX) {
      highestX = stone.position.col
    }
    if(stone.position.col < lowestX) {
      lowestX = stone.position.col
    }
  })

  return highestX - lowestX 
}

/*tc*/export/*etc*/function getHeightOfSelectedStones(stones) {
  if(stones.length<1){
    return 0
  }
  var highestY = stones[0].position.row
  var lowestY = stones[0].position.row

  stones.map((stone) => {
    if(stone.position.row > highestY) {
      highestY = stone.position.row
    }
    if(stone.position.row < lowestY) {
      lowestY = stone.position.row
    }
  })

  return highestY - lowestY
}

/*tc*/export/*etc*/function getTopLeftStoneOfSelectedStones(stones) {
  if(stones.length < 1) {
    return false
  }
  var lowestX = 200, lowestY = 200 //some high number
  var lowestStone
  stones.map((stone) => {
    if(stone.position.col <= lowestX && stone.position.row <= lowestY){
      lowestX = stone.position.col
      lowestY = stone.position.row
      lowestStone = stone
    }
  })
  return lowestStone
}

/*tc*/export/*etc*/function stoneAtPositionIsNotSelected(selectedStones, position) {
  var stoneIsSelected = false
  selectedStones.map((stone) => {
    if(stone.position.col == position.col && 
        stone.position.row == position.row) {
      stoneIsSelected = true
    }
  })
  return stoneIsSelected
}

/*tc*/export/*etc*/function stonesBuildAMovableFigure(state) {
  var width = getWidthOfSelectedStones(state.selectedStones) + 1
  var height = getHeightOfSelectedStones(state.selectedStones) + 1
  var topLeftStone = getTopLeftStoneOfSelectedStones(state.selectedStones)
  if(!topLeftStone) {
    return false
  }
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      var position = {
        col: topLeftStone.position.col + i,
        row: topLeftStone.position.row + j
      }
      if(!stoneAtPositionIsNotSelected(state.selectedStones, position)) {
        return false
      }
    }
  }
  return true
}

/*tc*/export/*etc*/function clickedStoneHasOwnColor(state, clickedStone) {
  return state.gameState.activePlayer == clickedStone.player
}

/*tc*/export/*etc*/function clickedStoneIsAlreadySelected(state, clickedStone) {
  var stones = state.selectedStones.filter((stone) => {
    return stone.id == clickedStone.id
  })
  return stones.length > 0
}

/*tc*/export/*etc*/function getStoneFromID(state, stoneID) {
  return state.stones.find((stone) => {
    return stone.id == stoneID
  })
}

/*tc*/export/*etc*/function removeStoneFromSelectedStones(selectedStones, stone) {
  var index = selectedStones.indexOf(clickedStone)
  selectedStones.splice(index, 1)
  return selectedStones
}

/*tc*/export/*etc*/function changeSelectedStones(state, stoneID) {
  var selectedStones = state.selectedStones.slice()
  var clickedStone = getStoneFromID(state, stoneID)
  if(clickedStoneHasOwnColor(state, clickedStone)) {
    if(!clickedStoneIsAlreadySelected(state, clickedStone)) {
      selectedStones.push(clickedStone)
    }else{
      selectedStones = removeStoneFromSelectedStones(selectedStones, stone)
    }
  }
  return selectedStones
}

/*tc*/export/*etc*/function isTopLeftStone(stone) {
  return stone.position.row == 0 && stone.position.col == 0
}

/*tc*/export/*etc*/function isBottomLeftStone(stone) {
  return stone.position.row == 9 && stone.position.col == 0
}

/*tc*/export/*etc*/function isTopRightStone(stone) {
  return stone.position.row == 0 && stone.position.col == 9
}

/*tc*/export/*etc*/function isBottomRightStone(stone) {
  return stone.position.row == 9 && stone.position.col == 9
}

/*tc*/export/*etc*/function possibleTurnsDiagonal (state) {
  var possTurns = createEmptyBoardMatrix(state.field.length)
  var x = getWidthOfSelectedStones(state.selectedStones) + 1
  var y = getHeightOfSelectedStones(state.selectedStones) + 1
  var topLeftStone = getTopLeftStoneOfSelectedStones(state.selectedStones)
  
  //define edges
  if (isTopLeftStone(topLeftStone)) {
    for (var i = 1; i < state.field.length; i++) {
      if (state.field[i][i] == 0) {
        possTurns[i][i] = 1
      } else {
        break
      }
    }
  } else if (isTopRightStone(topLeftStone)) {
    for (var i = state.field.length - 1; i > 0; i--) {
      if (state.field[i - 1][state.field.length - i] == 0) {
        possTurns[i - 1][state.field.length - i] = 1
      } else {
        break
      }
    }
  } else if (isBottomLeftStone(topLeftStone)) {
    for (var i = 1; i < state.field.length; i++) {
      if (state.field[i][state.field.length - i - 1] == 0) {
        possTurns[i][state.field.length - i - 1] = 1
      } else {
        break
      }
    }
  } else if (isBottomRightStone(topLeftStone)) {
    for (var i = state.field.length - 2; i >= 0; i--) {
      if (state.field[i][i] == 0) {
        possTurns[i][i] = 1
      } else {
        break
      }
    }
  }

  return possTurns;
}

/*tc*/export/*etc*/function possibleTurnsVertical (state) {
  var possTurns = createEmptyBoardMatrix(state.field.length)
  var x = getWidthOfSelectedStones(state.selectedStones) + 1
  var y = getHeightOfSelectedStones(state.selectedStones) + 1
  var lowestStone = getTopLeftStoneOfSelectedStones(state.selectedStones)

  var colorOpp = Player.WHITE
  if (lowestStone.player == Player.WHITE) {
      colorOpp = Player.BLACK
  }

  //proof below
  //in front of opponent?
  try {
    var nextToOpp = false
    for (var i = 0; i < x; i++) {
      if (state.field[lowestStone.position.col + i][lowestStone.position.row + y] == colorOpp) {
        nextToOpp = true
      }
      if (state.field[lowestStone.position.col + i][lowestStone.position.row + y] == lowestStone.player || state.field[lowestStone.position.col + i][lowestStone.position.row + y] == Player.GOLD) {
        nextToOpp = false
        break
      }
    }
    if (nextToOpp) {
      //determine length of opponent
      var lengthOpp = 1
      var k = lowestStone.position.row + y
      for (var j = 0; j < x; j++) {
        var b = 1
        try {
          while (state.field[lowestStone.position.col + j][k + b] == colorOpp) {
            b++
          }
        } catch (e) {
          break
        }
        if (b > lengthOpp) {
          lengthOpp = b;
        }
      }
      if (lengthOpp < y) {
        for (var i = 0; i < state.field[0].length - lowestStone.position.row - y; i++) {
          //is there an obstacle?
          var a = false
          for (var j = 0; j < x; j++) {
            try {
              if (state.field[lowestStone.position.col + j][lowestStone.position.row + i + y + lengthOpp] != 0) {
                a = true
              }
            } catch (e) {
              a = true
            }
          }
          //mark fields as possible
          if (a == false) {
            possTurns[lowestStone.position.col][lowestStone.position.row + i + 1] = 1;
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 0; i < state.field[0].length - lowestStone.position.row - y; i++) {
        //is there an obstacle
        var a = false
        for (var j = 0; j < x; j++) {
          if (state.field[lowestStone.position.col + j][lowestStone.position.row + i + y] != 0) {
            a = true
          }
        }
        //mark fields as possible
        if (a == false) {
          possTurns[lowestStone.position.col][lowestStone.position.row + i + 1] = 1;
        } else {
          break
        }
      }
    }
  } catch (e) {
  }

  //proof above
  try {
    //in front of opponent?
    var nextToOpp = false
    for (var i = 0; i < x; i++) {
      if (state.field[lowestStone.position.col + i][lowestStone.position.row - 1] == colorOpp) {
        nextToOpp = true
      }
      if (state.field[lowestStone.position.col + i][lowestStone.position.row - 1] == lowestStone.player || state.field[lowestStone.position.col + i][lowestStone.position.row - 1] == Player.GOLD) {
        nextToOpp = false
        break
      }
    }
    if (nextToOpp) {
      //determine length of opponent
      var lengthOpp = 1
      var k = lowestStone.position.row
      for (var j = 0; j < x; j++) {
        var b = 1
        try {
          while (state.field[lowestStone.position.col + j][k - b - 1] == colorOpp) {
            b++
          }
        } catch (e) {
          break
        }
        if (b > lengthOpp) {
          lengthOpp = b
        }
      }
      //can opponent be moved?
      if (lengthOpp < y) {
        for (var i = 1; i <= lowestStone.position.row; i++) {
          //is there an obstacle?
          var a = false
          for (var j = 0; j < x; j++) {
            try {
              if (state.field[lowestStone.position.col + j][lowestStone.position.row - lengthOpp - i] != 0) {
                a = true
              }
            } catch (e) {
              a = true
            }
          }
          //mark fields as possible
          if (a == false) {
            possTurns[lowestStone.position.col][lowestStone.position.row - i] = 1
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 1; i <= lowestStone.position.row; i++) {
        //is there an obstacle?
        var a = false
        for (var j = 0; j < x; j++) {
          if (state.field[lowestStone.position.col + j][lowestStone.position.row - i] != 0) {
            a = true
          }
        }
        //mark fields as possible
        if (a == false) {
          possTurns[lowestStone.position.col][lowestStone.position.row - i] = 1
        } else {
          break
        }
      }
    }
  } catch (e) {
  }

  return possTurns;
}

/*tc*/export/*etc*/function possibleTurnsHorizontal(state) {
  var possTurns = createEmptyBoardMatrix(state.field.length)
  var x = getWidthOfSelectedStones(state.selectedStones) + 1
  var y = getHeightOfSelectedStones(state.selectedStones) + 1
  var lowestStone = getTopLeftStoneOfSelectedStones(state.selectedStones)

  var colorOpp = Player.WHITE
  if (lowestStone.player == Player.WHITE) {
      colorOpp = Player.BLACK
  }

  //proof right
  try {
    var nextToOpp = false
    for (var i = 0; i < y; i++) {
      if (state.field[lowestStone.position.col + x][lowestStone.position.row + i] == colorOpp) {
        nextToOpp = true
      }
      if (state.field[lowestStone.position.col + x][lowestStone.position.row + i] == lowestStone.player || state.field[lowestStone.position.col + x][lowestStone.position.row + i] == Player.GOLD) {
        nextToOpp = false
        break
      }
    }
    if (nextToOpp) {
      //determine length of the opponent
      var lengthOpp = 1;
      var k = lowestStone.position.col + x;
      for (var j = 0; j < y; j++) {
        var b = 1
        try {
          while (state.field[k + b][lowestStone.position.row + j] == colorOpp) {
            b++
          }
        } catch (e) {
          break
        }
        if (b > lengthOpp) {
          lengthOpp = b
        }
      }
      //is it possible to move opponent?
      if (lengthOpp < x) {
        for (var i = 0; i < state.field.length - lowestStone.position.col - x; i++) {
          //ist there an obstacle
          var a = false
          for (var j = 0; j < y; j++) {
            try {
              if (state.field[lowestStone.position.col + i + x + lengthOpp][lowestStone.position.row + j] != 0) {
                a = true
              }
            } catch (e) {
              a = true
            }
          }
          //mark fields as possible
          if (a == false) {
            possTurns[lowestStone.position.col + i + 1][lowestStone.position.row] = 1
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 0; i < state.field.length - lowestStone.position.col - x; i++) {
        //is there an obstacle
        var a = false
        for (var j = 0; j < y; j++) {
          if (state.field[lowestStone.position.col + i + x][lowestStone.position.row + j] != 0) {
            a = true
          }
        }
        //mark fields as possible
        if (a == false) {
          possTurns[lowestStone.position.col + i + 1][lowestStone.position.row] = 1;
        } else {
          break
        }
      }
    }
  } catch (e) {}
  //proof left
  try {
    var nextToOpp = false
    for (var i = 0; i < y; i++) {
      if (state.field[lowestStone.position.col - 1][lowestStone.position.row + i] == colorOpp) {
        nextToOpp = true
      }
      if (state.field[lowestStone.position.col - 1][lowestStone.position.row + i] == lowestStone.player || state.field[lowestStone.position.col - 1][lowestStone.position.row + i] == Player.GOLD) {
        nextToOpp = false
        break
      }
    }
    if (nextToOpp) {
      //determine length of opponent
      var lengthOpp = 1
      var k = lowestStone.position.col
      for (var j = 0; j < y; j++) {
        var b = 1
        try {
          while (state.field[k - b - 1][lowestStone.position.row + j] == colorOpp) {
            b++
          }
        } catch (e) {
          break
        }
        if (b > lengthOpp) {
          lengthOpp = b
        }
      }
      //is it possible to move opponent?
      if (lengthOpp < x) {
        for (var i = 1; i <= lowestStone.position.col; i++) {
          //is there an obstacle?
          var a = false
          for (var j = 0; j < y; j++) {
            try {
              if (state.field[lowestStone.position.col - lengthOpp - i][lowestStone.position.row + j] != 0) {
                a = true
              }
            } catch (e) {
                a = true
            }
          }
          //mark fields as possible
          if (a == false) {
            possTurns[lowestStone.position.col - i][lowestStone.position.row] = 1;
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 1; i <= lowestStone.position.col; i++) {
        //is there an obstacle
        var a = false
        for (var j = 0; j < y; j++) {
          if (state.field[lowestStone.position.col - i][lowestStone.position.row + j] != 0) {
            a = true
          }
        }
        //mark fields as possible
        if (a == false) {
          possTurns[lowestStone.position.col - i][lowestStone.position.row] = 1;
        } else {
          break
        }
      }
    }
  } catch (e) {

  }
  return possTurns
}

/*tc*/export/*etc*/function isCornerStone(stone) {
  return (stone.position.row == 0 || stone.position.row == 9) && (stone.position.col == 0 || stone.position.col == 9)
}

/*tc*/export/*etc*/function getJoinedPossibleTurns(possibleTurnsA, possibleTurnsB) {
  var joinedPossibleTurns = possibleTurnsA.slice()
  for (var i = 0; i < possibleTurnsB.length; i++) {
    for (var j = 0; j < possibleTurnsB[i].length; j++) {
      if (possibleTurnsB[i][j] > 0) {
        joinedPossibleTurns[i][j] = possibleTurnsB[i][j]
      }
    }
  }
  return joinedPossibleTurns
}

/*tc*/export/*etc*/function getPossibleTurnsForSelectedStones(state) {
  var possTurns = createEmptyBoardMatrix(10)

  if(stonesBuildAMovableFigure(state)) {
    var x = getWidthOfSelectedStones(state.selectedStones)
    var y = getHeightOfSelectedStones(state.selectedStones)
    if(x == y) {
      //block
      possTurns = possibleTurnsHorizontal(state)
      var possTurns2 = possibleTurnsVertical(state)

      //join arrays
      possTurns = getJoinedPossibleTurns(possTurns, possTurns2);
    
      var stones = state.selectedStones
      if (stones.length == 1 && isCornerStone(stones[0])) {
        //Diagonal
        var possTurns3 = possibleTurnsDiagonal(state)
        //join arrays
        possTurns = getJoinedPossibleTurns(possTurns, possTurns3)        
      }
    } else if (x > y) {
      //horizontal
      possTurns = possibleTurnsHorizontal(state)
    } else if (x < y) {
      //vertical
      possTurns = possibleTurnsVertical(state)
    }
  }
  return possTurns
}

/*tc*/export/*etc*/function directionBLA (stones, destination) {
  var direction = 0;
  if (destination.col != stones[0].position.col && destination.row != stones[0].position.row) {
      //diagonal
      return 4;
  }

  if (destination.col != stones[0].position.col) {
    if (destination.col - stones[0].position.col > 0) {
        //right
        return 0
    } else {
        //left
        return 1
    }
  } else {
    if (destination.row - stones[0].position.row > 0) {
        //bottom
        return 2
    } else {
        //above
        return 3
    }
  }
  return direction
}

/*tc*/export/*etc*/function setTurn(state, destination) {
  var moves = [];
  var newState = Object.assign({}, state)
  var stones = newState.selectedStones
  var x = getWidthOfSelectedStones(stones)
  var y = getHeightOfSelectedStones(stones)
  var lowestStone = Object.assign({}, getTopLeftStoneOfSelectedStones(stones))

  var colorOpp = Player.WHITE
  if (lowestStone.player == Player.WHITE) {
      colorOpp = Player.BLACK
  }

  //delete stones on field
  for (var i = 0; i < stones.length; i++) {
    state.field[stones[i].position.col][stones[i].position.row] = 0
    moves.push(
      {
        stone: stones[i], 
        destination: {
          col: 0, 
          row: 0
        }
      }
    )
  }

  //place stones of opponent new
  var direction = directionBLA(stones, destination)
  switch (direction) {
  case 0:
    for (var i = 0; i <= destination.col - lowestStone.position.col; i++) {
      for (var j = 0; j < y + 1; j++) {
        if (newState.field[lowestStone.position.col + x + i] && newState.field[lowestStone.position.col + x + i][lowestStone.position.row + j] == colorOpp) {
          newState.field[destination.col + x + i][destination.row + j] = colorOpp
          newState.field[lowestStone.position.col + x + i][lowestStone.position.row + j] = 0
          moves.push(
            {
              stone: {
                player: colorOpp,
                position: {
                  col: lowestStone.position.col + x + i,
                  row: lowestStone.position.row + j
                }
              }, 
              destination: 
                {
                  col: destination.col + x + i, 
                  row: destination.row + j
                }
            }
          )
        }
      }
    }
    break
  case 1:
    var lengthOpp = 0
    var k = lowestStone.position.col
    for (var j = 0; j < y + 1; j++) {
      var b = 0
      try {
        while (newState.field[k - b - 1][lowestStone.position.row + j] == colorOpp) {
          b++
        }
      } catch (e) {
        break
      }
      if (b > lengthOpp) {
        lengthOpp = b
      }
    }

    for (var i = 0; i <= lengthOpp; i++) {
      for (var j = 0; j < y + 1; j++) {
        if (newState.field[lowestStone.position.col - i][lowestStone.position.row + j] == colorOpp) {
          newState.field[destination.col - i][destination.row + j] = colorOpp
          newState.field[lowestStone.position.col - i][lowestStone.position.row + j] = 0
          moves.push(
            {
              stone: {
                player: colorOpp,
                position: {
                  col: lowestStone.position.col - i,
                  row: lowestStone.position.row + j
                }
              }, 
              destination: {
                col: destination.col - i, 
                row: destination.row + j
              }
            }
          )
        }
      }
    }
    break
  case 2:
    //determine length of opponent
    var lengthOpp = 0
    var k = lowestStone.position.row + y + 1
    for (var j = 0; j < x + 1; j++) {
      var b = 0
      try {
        while (newState.field[lowestStone.position.col + j][k + b] == colorOpp) {
          b++
        }
      } catch (e) {
        break
      }
      if (b > lengthOpp) {
        lengthOpp = b
      }
    }
    for (var i = 0; i <= destination.row - lowestStone.position.row; i++) {
      for (var j = 0; j < x + 1; j++) {
        if (newState.field[lowestStone.position.col + j][lowestStone.position.row + y + i] == colorOpp) {
          newState.field[destination.col + j][destination.row + y + i] = colorOpp
          newState.field[lowestStone.position.col + j][lowestStone.position.row + y + i] = 0
          moves.push(
            {
              stone: {
                player: colorOpp,
                position: {
                  col: lowestStone.position.col + j,
                  row: lowestStone.position.row + y + i
                }
              }, 
              destination: {
                col: destination.col + j, 
                row: destination.row + y + i
              }
            }
          )
        }
      }
    }
    break
  case 3:
    //determine length of opponent
    var lengthOpp = 0
    var k = lowestStone.position.row
    for (var j = 0; j < x + 1; j++) {
      var b = 0
      try {
        while (newState.field[lowestStone.position.col + j][k - b - 1] == colorOpp) {
          b++
        }
      } catch (e) {
        break
      }
      if (b > lengthOpp) {
        lengthOpp = b
      }
    }

    for (var i = 0; i <= lengthOpp; i++) {
      for (var j = 0; j < x + 1; j++) {
        if (newState.field[lowestStone.position.col + j][lowestStone.position.row - i] == colorOpp) {
          newState.field[destination.col + j][destination.row - i] = colorOpp
          newState.field[lowestStone.position.col + j][lowestStone.position.row - i] = 0
          moves.push(
            {
              stone: {
                player: colorOpp,
                position: {
                  col: lowestStone.position.col + j,
                  row: lowestStone.position.row - i
                }
              }, 
              destination: {
                col: destination.col + j, 
                row: destination.row - i
              }
            }
          )
        }
      }
    }
    break
  }

  //position stones new
  var counter = 0
  for (var i = 0; i <= x; i++) {
    for (var j = 0; j <= y; j++) {
      newState.field[destination.col + i][destination.row + j] = stones[i].player
      moves[counter].destination = {
        col: destination.col + i,
        row: destination.row + j
      }

      counter++
    }
  }

  moves.map((move) => {
    var index = -1
    newState.stones.map((stone, i) => {
      if(move.stone.position.col == stone.position.col &&
          move.stone.position.row == stone.position.row){
        index = i
      }
    })
    if(index > -1){
      newState.stones[index].position = move.destination
    }
  })

  return newState
}

/*tc*/export/*etc*/function turnIsAllowed(state, destination) {
  return state.possibleTurns[destination.col] && state.possibleTurns[destination.col][destination.row] == 1
}

/*tc*/export/*etc*/function makeTurn(state, action) {
  var newState = Object.assign({}, state)
  if(turnIsAllowed(state, action.position)){
    newState = setTurn(state, action.position)
    newState.selectedStones = []
    newState.possibleTurns = []
    newState.gameState = switchGameState(state)
  }
  return newState
}

/*tc*/export/*etc*/function initialState() {
  return {
    level: {},
    gameState: {
      state: GameStates.WHITE_PLAYER_SET_STONE,
      activePlayer: Player.WHITE
    },
    field: createEmptyBoardMatrix(10),
    stones: [],
    selectedStones: [],
    possibleTurns: createEmptyBoardMatrix(10)
  }
}

/*tc*/export/*etc*/function createEmptyBoardMatrix(size) {
  var matrix = []
  for(var i=0;i<size;i++) {
    matrix.push(Array(size).fill(0))
  }
  return matrix
}

/*tc*/export/*etc*/function stones(state = initialState(), action) {
  switch (action.type) {
    case SELECT_LEVEL:
      var newState = Object.assign({}, state)
      var level = getLevelFromName(action.level)
      if(level) {
        newState.level = level
      }
      return newState
    case SET_STONE:
      var newState = Object.assign({}, state)
      if(state.gameState.state == GameStates.WHITE_PLAYER_SET_STONE ||
          state.gameState.state == GameStates.BLACK_PLAYER_SET_STONE ||
          state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE){
        if(state.gameState.state == GameStates.WHITE_PLAYER_SET_STONE &&
            action.player != Player.WHITE){
          return newState
        }
        if(state.gameState.state == GameStates.BLACK_PLAYER_SET_STONE &&
            action.player != Player.BLACK){
          return newState
        }
        if(state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE &&
            action.player != Player.BLACK){
          return newState
        }
        if(positionIsAllowed(state, action)){
          var player = action.player
          if(state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE){
            player = Player.GOLD
          }
          if(state.stones.length / 2 < state.level.count + 2 || state.gameState.state == GameStates.BLACK_PLAYER_SET_GOLDEN_STONE) {
            newState.stones.push(
              {
                id: 'stone' + state.stones.length,
                player: player,
                position: action.position
              })
            newState.field[action.position.col][action.position.row] = action.player
            newState.gameState = switchGameState(state)
          }else{
            newState.gameState = {
              state: GameStates.BLACK_PLAYER_SET_GOLDEN_STONE,
              activePlayer: Player.BLACK
            }
          }
        }
      }else if(state.gameState.state == GameStates.WHITE_PLAYER_MAKE_TURN ||
          state.gameState.state == GameStates.BLACK_PLAYER_MAKE_TURN) {
        newState = makeTurn(state, action)
      }
      return newState
    case STONE_CLICKED:
      var newState = Object.assign({}, state)
      if(state.gameState.state == GameStates.WHITE_PLAYER_MAKE_TURN ||
          state.gameState.state == GameStates.BLACK_PLAYER_MAKE_TURN){
        newState.selectedStones = changeSelectedStones(newState, action.stoneID)
        newState.possibleTurns = getPossibleTurnsForSelectedStones(newState)
      }
      return newState
    case MAKE_TURN:
      return Object.assign({}, state)
    default:
      return state
  }
}

export default stones