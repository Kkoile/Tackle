import { GameStates, Player, FIELD_SIZE } from '../constants/game'

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

/*tc*/export/*etc*/function removeStoneFromSelectedStones(selectedStones, stone) {
  var index = selectedStones.indexOf(stone)
  selectedStones.splice(index, 1)
  return selectedStones
}

/*tc*/export/*etc*/function changeSelectedStones(state, clickedStone) {
  var selectedStones = state.selectedStones.slice()
  if(clickedStoneHasOwnColor(state, clickedStone)) {
    if(!clickedStoneIsAlreadySelected(state, clickedStone)) {
      selectedStones.push(clickedStone)
    }else{
      selectedStones = removeStoneFromSelectedStones(selectedStones, clickedStone)
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
  var possTurns = createEmptyBoardMatrix()

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

/*tc*/export/*etc*/function createEmptyBoardMatrix() {
  var matrix = []
  for(var i=0;i<FIELD_SIZE;i++) {
    matrix.push(Array(FIELD_SIZE).fill(0))
  }
  return matrix
}

/*tc*/export/*etc*/function get90DegreeLevel(tiles) {
  var newTiles = []
  var rows = tiles.length
  var cols = tiles[0].length

  //TODO: Got it to work
  for(var i=0;i<cols;i++){
    newTiles.push(Array(rows).fill(1))
  }
  tiles.map((row, i) => {
    row.map((tile, j) => {

    })
  })

  return newTiles
}

/*tc*/export/*etc*/function playerHasWon (state, player) {
  //Existiert die Figur auf dem Feld?
  for (var i = 1; i < state.field.length - 1; i++) {
    for (var j = 1; j < state.field[i].length - 1; j++) {
      var a = true
      for (var k = 0; k < state.level.tiles.length; k++) {
        for (var k2 = 0; k2 < state.level.tiles[k].length; k2++) {
          try {
            if (parseInt(i) + k > state.field.length - 2 || parseInt(j) + k2 > state.field[i].length - 2) {
              a = false
              break
            }
            if (state.level.tiles[k][k2] == 2 && state.field[parseInt(i) + k][parseInt(j) + k2] / player == 1) {
              a = false
              break
            }
            if (state.level.tiles[k][k2] == 1 && state.field[parseInt(i) + k][parseInt(j) + k2] / player != state.level.tiles[k][k2]) {
              a = false
              break
            }
          } catch (e) {
            a = false
          }
        }
        if (!a) {
          break
        }
      }
      if (a) {
        return true
      }
    }
  }

  var figur90 = get90DegreeLevel(state.level.tiles)

  for (var i = 1; i < state.field.length - 1; i++) {
    for (var j = 1; j < state.field[i].length - 1; j++) {
      var a = true;
      for (var k = 0; k < figur90.length; k++) {
        for (var k2 = 0; k2 < figur90[k].length; k2++) {
          try {
            if (parseInt(i) + k > state.field.length - 2 || parseInt(j) + k2 > state.field[i].length - 2) {
              a = false
              break
            }
            if (figur90[k][k2] == 2 && state.field[parseInt(i) + k][parseInt(j) + k2] / player == 1) {
              a = false
              break
            }
            if (figur90[k][k2] == 1 && state.field[parseInt(i) + k][parseInt(j) + k2] / player != figur90[k][k2]) {
              a = false
              break
            }
          } catch (e) {
            a = false
          }
        }
        if (!a) {
          break
        }
      }
      if (a) {
        return true
      }
    }
  }
}
