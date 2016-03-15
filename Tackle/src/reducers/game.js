import { combineReducers } from 'redux'
import { SET_STONE, SET_GOLDEN_STONE, MAKE_TURN, SELECT_LEVEL, STONE_CLICKED } from '../actions/game'
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

function getWidthOfSelectedStones(stones) {
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

function getHeightOfSelectedStones(stones) {
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

function getLowestStoneOfSelectedStones(stones) {
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

function stonesBuildAMovableFigure(state) {
  var width = getWidthOfSelectedStones(state.selectedStones) + 1
  var height = getHeightOfSelectedStones(state.selectedStones) + 1
  var lowestStone = getLowestStoneOfSelectedStones(state.selectedStones)
  if(!lowestStone) {
    return false
  }
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      if (state.field[lowestStone.position.col + i] && state.field[lowestStone.position.col + i][lowestStone.position.row + j] != lowestStone.player) {
          return false
      }
    }
  }
  return true
}

function changeSelectedStones(state, stoneID) {
  var selectedStones = state.selectedStones
  var clickedStone = state.stones.filter((stone) => {
    return stone.id == stoneID
  })[0]
  if(state.gameState.activePlayer == clickedStone.player) {
    var stones = state.selectedStones.filter((stone) => {
      return stone.id == clickedStone.id
    })
    if(stones.length == 0) {
      selectedStones.push(clickedStone)
    }else{
      var index = selectedStones.indexOf(clickedStone)
      selectedStones.splice(index, 1)
    }
  }
  return selectedStones
}

function possibleTurnsDiagonal (state) {
  var possTurns = []
  var x = getWidthOfSelectedStones(state.selectedStones) + 1
  var y = getHeightOfSelectedStones(state.selectedStones) + 1
  var lowestStone = getLowestStoneOfSelectedStones(state.selectedStones)
  var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (var i = 0; i < 10; i++) {
    possTurns[i] = JSON.parse(JSON.stringify(temp))
  }

  //define edges
  if (lowestStone.position.col == 0 && lowestStone.position.row == 0) {
    //top left
    for (var i = 1; i < state.field.length; i++) {
      if (state.field[i][i] == 0) {
        possTurns[i][i] = 1
      } else {
        break
      }
    }
  } else if (lowestStone.position.col == state.field.length - 1 && lowestStone.position.row == 0) {
    //top right
    for (var i = state.field.length - 1; i > 0; i--) {
      if (state.field[i - 1][state.field.length - i] == 0) {
        possTurns[i - 1][state.field.length - i] = 1
      } else {
        break
      }
    }
  } else if (lowestStone.position.col == 0 && lowestStone.position.row == state.field.length - 1) {
    //bottom left
    for (var i = 1; i < state.field.length; i++) {
      if (state.field[i][state.field.length - i - 1] == 0) {
        possTurns[i][state.field.length - i - 1] = 1
      } else {
        break
      }
    }
  } else if (lowestStone.position.col == state.field.length - 1 && lowestStone.position.row == state.field.length - 1) {
    //bottom right
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

function possibleTurnsVertical (state) {
  var possTurns = []
  var x = getWidthOfSelectedStones(state.selectedStones) + 1
  var y = getHeightOfSelectedStones(state.selectedStones) + 1
  var lowestStone = getLowestStoneOfSelectedStones(state.selectedStones)
  var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (var i = 0; i < 10; i++) {
      possTurns[i] = JSON.parse(JSON.stringify(temp))
  }

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

function possibleTurnsHorizontal(state) {
  var possTurns = []
  var x = getWidthOfSelectedStones(state.selectedStones) + 1
  var y = getHeightOfSelectedStones(state.selectedStones) + 1
  var lowestStone = getLowestStoneOfSelectedStones(state.selectedStones)

  var temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (var i = 0; i < 10; i++) {
      possTurns[i] = JSON.parse(JSON.stringify(temp))
  }

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

function getPossibleTurnsForSelectedStones(state) {
  var possTurns = []
  if(stonesBuildAMovableFigure(state)) {
    var x = getWidthOfSelectedStones(state.selectedStones)
    var y = getHeightOfSelectedStones(state.selectedStones)
    if(x == y) {
      //block
      possTurns = possibleTurnsHorizontal(state)
      var possTurns2 = possibleTurnsVertical(state)
      //join arrays
      for (var i = 0; i < possTurns2.length; i++) {
        for (var j = 0; j < possTurns2[i].length; j++) {
          if (possTurns2[i][j] > 0) {
            possTurns[i][j] = possTurns2[i][j]
          }
        }
      }

      var stones = state.selectedStones
      if (stones.length == 1 && ((stones[0].position.col == 0 && stones[0].position.row == 0) || (stones[0].position.col == 0 && stones[0].position.row == 9) ||
          (stones[0].position.col == 9 && stones[0].position.row == 0) || (stones[0].position.col == 9 && stones[0].position.row == 9))) {
        //Diagonal
        var possTurns3 = possibleTurnsDiagonal(state)
        //join arrays
        for (var i = 0; i < possTurns3.length; i++) {
          for (var j = 0; j < possTurns3[i].length; j++) {
            if (possTurns3[i][j] > 0) {
              possTurns[i][j] = possTurns3[i][j]
            }
          }
        }
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

function directionBLA (stones, destination) {
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

function setTurn(state, destination) {
  var moves = [];
  var newState = Object.assign({}, state)
  var stones = newState.selectedStones
  var x = getWidthOfSelectedStones(stones)
  var y = getHeightOfSelectedStones(stones)
  var lowestStone = Object.assign({}, getLowestStoneOfSelectedStones(stones))

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
    for (var i = 0; i <= destination.row - lowestStone.row; i++) {
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
    }else{
      console.log('------stones-------')
      console.log(newState.stones)
      console.log('------moves-------')
      console.log(move)
    }
  })

  return newState
}

function turnIsAllowed(state, destination) {
  return state.possibleTurns[destination.col] && state.possibleTurns[destination.col][destination.row] == 1
}

function makeTurn(state, action) {
  var newState = Object.assign({}, state)
  if(turnIsAllowed(state, action.position)){
    newState = setTurn(state, action.position)
    newState.selectedStones = []
    newState.possibleTurns = []
  }
  return newState
}

function initialState() {
  return {
    level: {},
    gameState: {
      state: GameStates.WHITE_PLAYER_SET_STONE,
      activePlayer: Player.WHITE
    },
    field: [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0]],
    stones: [],
    selectedStones: [],
    possibleTurns: []
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
          newState.field[action.position.col][action.position.row] = action.player
          newState.gameState = switchGameState(state)
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