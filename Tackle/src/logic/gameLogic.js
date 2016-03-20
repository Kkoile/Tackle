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
  var topLeftStone
  stones.map((stone) => {
    if(stone.position.col <= lowestX && stone.position.row <= lowestY){
      lowestX = stone.position.col
      lowestY = stone.position.row
      topLeftStone = stone
    }
  })
  return topLeftStone
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
  var { width, height, topLeftStone } = getSelectedStonesInfo(state)

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

/*tc*/export/*etc*/function getPossibleTurnsDiagonal (state) {
  var possibleTurns = createEmptyBoardMatrix()
  var topLeftStone = getTopLeftStoneOfSelectedStones(state.selectedStones)
  
  //define edges
  if (isTopLeftStone(topLeftStone)) {
    for (var i = 1; i < state.field.length; i++) {
      if (state.field[i][i] == 0) {
        possibleTurns[i][i] = 1
      } else {
        break
      }
    }
  } else if (isTopRightStone(topLeftStone)) {
    for (var i = state.field.length - 1; i > 0; i--) {
      if (state.field[i - 1][state.field.length - i] == 0) {
        possibleTurns[i - 1][state.field.length - i] = 1
      } else {
        break
      }
    }
  } else if (isBottomLeftStone(topLeftStone)) {
    for (var i = 1; i < state.field.length; i++) {
      if (state.field[i][state.field.length - i - 1] == 0) {
        possibleTurns[i][state.field.length - i - 1] = 1
      } else {
        break
      }
    }
  } else if (isBottomRightStone(topLeftStone)) {
    for (var i = state.field.length - 2; i >= 0; i--) {
      if (state.field[i][i] == 0) {
        possibleTurns[i][i] = 1
      } else {
        break
      }
    }
  }

  return possibleTurns
}

/*tc*/export/*etc*/function selectedStonesAreInFrontOfOpponentBelow (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row
  var nextToOpp = false
  if (!state.field[topLeftX][topLeftY + height]){
    return false
  }
  for (var i = 0; i < width; i++) {
    var field = state.field[topLeftX + i][topLeftY + height]
    if (field == colorOpp) {
      nextToOpp = true
    }
    if (field == topLeftStone.player || field == Player.GOLD) {
      return false
    }
  }
  return nextToOpp
}

/*tc*/export/*etc*/function selectedStonesAreInFrontOfOpponentAbove (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row
  var nextToOpp = false
  if (!state.field[topLeftX][topLeftY - 1]){
    return false
  }
  for (var i = 0; i < width; i++) {
    var field = state.field[topLeftX + i][topLeftY - 1]
    if (field == colorOpp) {
      nextToOpp = true
    }
    if (field == topLeftStone.player || field == Player.GOLD) {
      nextToOpp = false
      break
    }
  }
  return nextToOpp
}

/*tc*/export/*etc*/function selectedStonesAreInFrontOfOpponentRight (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row
  var nextToOpp = false
  if (!state.field[topLeftX + width]){
    return false
  }
  for (var i = 0; i < height; i++) {
    var field = state.field[topLeftX + width][topLeftY + i]
    if (field == colorOpp) {
      nextToOpp = true
    }
    if (field == topLeftStone.player || field == Player.GOLD) {
      nextToOpp = false
      break
    }
  }
  return nextToOpp
}

/*tc*/export/*etc*/function selectedStonesAreInFrontOfOpponentLeft (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row
  var nextToOpp = false
  if (!state.field[topLeftX - 1]){
    return false
  }
  for (var i = 0; i < height; i++) {
    var field = state.field[topLeftX - 1][topLeftY + i]
    if (field == colorOpp) {
      nextToOpp = true
    }
    if (field == topLeftStone.player || field == Player.GOLD) {
      nextToOpp = false
      break
    }
  }
  return nextToOpp
}

/*tc*/export/*etc*/function fieldHasGivenColor(state, x, y, colorOpp) {
  if(x < 0 || x > FIELD_SIZE - 1) {
    return false
  }
  if(y < 0 || y > FIELD_SIZE - 1) {
    return false
  }
  return state.field[x][y] == colorOpp
}

/*tc*/export/*etc*/function getLengthOfOpponentBelow (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var lengthOpp = 1
  var topLeftOpponentY = topLeftStone.position.row + height
  var topLeftX = topLeftStone.position.col
  for (var j = 0; j < width; j++) {
    var length = 1
    while (fieldHasGivenColor(state, topLeftX + j, topLeftOpponentY + length, colorOpp)) {
      length++
    }
    if (length > lengthOpp) {
      lengthOpp = length
    }
  }
  return lengthOpp
}

/*tc*/export/*etc*/function getLengthOfOpponentAbove (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var lengthOpp = 1
  var bottomLeftOpponentY = topLeftStone.position.row - 1
  var topLeftX = topLeftStone.position.col
  for (var j = 0; j < width; j++) {
    var length = 1
    while (fieldHasGivenColor(state, topLeftX + j, bottomLeftOpponentY - length, colorOpp)) {
      length++
    }
    if (length > lengthOpp) {
      lengthOpp = length
    }
  }
  return lengthOpp
}

/*tc*/export/*etc*/function getLengthOfOpponentRight (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var lengthOpp = 1
  var topLeftOpponentX = topLeftStone.position.col + width
  var topLeftY = topLeftStone.position.row
  for (var j = 0; j < height; j++) {
    var length = 1
    while (fieldHasGivenColor(state, topLeftOpponentX + length, topLeftY + j, colorOpp)) {
      length++
    }
    if (length > lengthOpp) {
      lengthOpp = length
    }
  }
  return lengthOpp
}

/*tc*/export/*etc*/function getLengthOfOpponentLeft (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var lengthOpp = 1
  var topRightOpponentX = topLeftStone.position.col - 1
  var topLeftY = topLeftStone.position.row
  for (var j = 0; j < height; j++) {
    var length = 1
    while (fieldHasGivenColor(state, topRightOpponentX - length, topLeftY + j, colorOpp)) {
      length++
    }
    if (length > lengthOpp) {
      lengthOpp = length
    }
  }
  return lengthOpp
}

/*tc*/export/*etc*/function thereIsNotAnObstacleBelow (state, selectedStonesInfo, lengthOpp, i) {
  var { width, height, topLeftStone } = selectedStonesInfo
  var thereIsNotAnObstacle = true
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row + height + lengthOpp

  for (var j = 0; j < width; j++) {
    if (!fieldHasGivenColor(state, topLeftX + j, topLeftY + i, 0)) {
      thereIsNotAnObstacle = false
    }
  }
  return thereIsNotAnObstacle
}

/*tc*/export/*etc*/function thereIsNotAnObstacleAbove (state, selectedStonesInfo, lengthOpp, i) {
  var { width, height, topLeftStone } = selectedStonesInfo
  var thereIsNotAnObstacle = true
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row - lengthOpp

  for (var j = 0; j < width; j++) {
    if (!fieldHasGivenColor(state, topLeftX + j, topLeftY - i, 0)) {
      thereIsNotAnObstacle = false
    }
  }
  return thereIsNotAnObstacle
}

/*tc*/export/*etc*/function thereIsNotAnObstacleRight (state, selectedStonesInfo, lengthOpp, i) {
  var { width, height, topLeftStone } = selectedStonesInfo
  var thereIsNotAnObstacle = true
  var topLeftX = topLeftStone.position.col + width + lengthOpp
  var topLeftY = topLeftStone.position.row

  for (var j = 0; j < height; j++) {
    if (!fieldHasGivenColor(state, topLeftX + i, topLeftY + j, 0)) {
      thereIsNotAnObstacle = false
    }
  }
  return thereIsNotAnObstacle
}

/*tc*/export/*etc*/function thereIsNotAnObstacleLeft (state, selectedStonesInfo, lengthOpp, i) {
  var { width, height, topLeftStone } = selectedStonesInfo
  var thereIsNotAnObstacle = true
  var topLeftX = topLeftStone.position.col - lengthOpp
  var topLeftY = topLeftStone.position.row
  for (var j = 0; j < height; j++) {
    if (!fieldHasGivenColor(state, topLeftX - i, topLeftY + j, 0)) {
      thereIsNotAnObstacle = false
    }
  }
  return thereIsNotAnObstacle
}

/*tc*/export/*etc*/function opponentIsShorterThanSelectedStones (lengthOpp, lengthSelectedStones) {
  return lengthOpp < lengthSelectedStones
}

/*tc*/export/*etc*/function getPossibleTurnsAboveFromSelectedStones (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var possibleTurns = createEmptyBoardMatrix()
  try {
    if (selectedStonesAreInFrontOfOpponentAbove(state, selectedStonesInfo)) {
      var lengthOpp = getLengthOfOpponentAbove(state, selectedStonesInfo)
      if (opponentIsShorterThanSelectedStones(lengthOpp, height)) {
        for (var i = 1; i <= topLeftStone.position.row; i++) {
          if (thereIsNotAnObstacleAbove(state, selectedStonesInfo, lengthOpp, i)) {
            possibleTurns[topLeftStone.position.col][topLeftStone.position.row - i] = 1
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 1; i <= topLeftStone.position.row; i++) {
        if (thereIsNotAnObstacleAbove(state, selectedStonesInfo, 0, i)) {
          possibleTurns[topLeftStone.position.col][topLeftStone.position.row - i] = 1
        } else {
          break
        }
      }
    }
  } catch (e) {
  }
  return possibleTurns
}

/*tc*/export/*etc*/function getPossibleTurnsBelowFromSelectedStones (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var possibleTurns = createEmptyBoardMatrix()
  try {
    if (selectedStonesAreInFrontOfOpponentBelow(state, selectedStonesInfo)) {
      var lengthOpp = getLengthOfOpponentBelow(state, selectedStonesInfo)
      if (opponentIsShorterThanSelectedStones(lengthOpp, height)) {
        for (var i = 0; i < state.field[0].length - topLeftStone.position.row - height; i++) {
          if (thereIsNotAnObstacleBelow(state, selectedStonesInfo, lengthOpp, i)) {
            possibleTurns[topLeftStone.position.col][topLeftStone.position.row + i + 1] = 1
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 0; i < state.field[0].length - topLeftStone.position.row - height; i++) {
        if (thereIsNotAnObstacleBelow(state, selectedStonesInfo, 0, i)) {
          possibleTurns[topLeftStone.position.col][topLeftStone.position.row + i + 1] = 1;
        } else {
          break
        }
      }
    }
  } catch (e) {
  }
  return possibleTurns
}

/*tc*/export/*etc*/function getPossibleTurnsRightFromSelectedStones (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var possibleTurns = createEmptyBoardMatrix()
  try {
    if (selectedStonesAreInFrontOfOpponentRight(state, selectedStonesInfo)) {
      var lengthOpp = getLengthOfOpponentRight(state, selectedStonesInfo)
      if (opponentIsShorterThanSelectedStones(lengthOpp, width)) {
        for (var i = 0; i < state.field.length - topLeftStone.position.col - width; i++) {
          if (thereIsNotAnObstacleRight(state, selectedStonesInfo, lengthOpp, i)) {
            possibleTurns[topLeftStone.position.col + i + 1][topLeftStone.position.row] = 1
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 0; i < state.field.length - topLeftStone.position.col - width; i++) {
        if (thereIsNotAnObstacleRight(state, selectedStonesInfo, 0, i)) {
          possibleTurns[topLeftStone.position.col + i + 1][topLeftStone.position.row] = 1
        } else {
          break
        }
      }
    }
  } catch (e) {
  }
  return possibleTurns
}

/*tc*/export/*etc*/function getPossibleTurnsLeftFromSelectedStones (state, selectedStonesInfo) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var possibleTurns = createEmptyBoardMatrix()
  try {
    if (selectedStonesAreInFrontOfOpponentLeft(state, selectedStonesInfo)) {
      var lengthOpp = getLengthOfOpponentLeft(state, selectedStonesInfo)
      if (opponentIsShorterThanSelectedStones(lengthOpp, width)) {
        for (var i = 1; i <= topLeftStone.position.col; i++) {
          if (thereIsNotAnObstacleLeft(state, selectedStonesInfo, lengthOpp, i)) {
            possibleTurns[topLeftStone.position.col - i][topLeftStone.position.row] = 1
          } else {
            break
          }
        }
      }
    } else {
      for (var i = 1; i <= topLeftStone.position.col; i++) {
        if (thereIsNotAnObstacleLeft(state, selectedStonesInfo, 0, i)) {
          possibleTurns[topLeftStone.position.col - i][topLeftStone.position.row] = 1
        } else {
          break
        }
      }
    }
  } catch (e) {
  }
  return possibleTurns
}

/*tc*/export/*etc*/function getPossibleTurnsVertical (state, selectedStonesInfo) {
  var possibleTurnsBelow = getPossibleTurnsBelowFromSelectedStones(state, selectedStonesInfo)
  var possibleTurnsAbove = getPossibleTurnsAboveFromSelectedStones(state, selectedStonesInfo)

  return getJoinedPossibleTurns(possibleTurnsBelow, possibleTurnsAbove)
}

/*tc*/export/*etc*/function getPossibleTurnsHorizontal(state, selectedStonesInfo) {
  var possibleTurnsRight = getPossibleTurnsRightFromSelectedStones(state, selectedStonesInfo)
  var possibleTurnsLeft = getPossibleTurnsLeftFromSelectedStones(state, selectedStonesInfo)

  return getJoinedPossibleTurns(possibleTurnsRight, possibleTurnsLeft)
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

/*tc*/export/*etc*/function getSelectedStonesInfo(state) {
  var width = getWidthOfSelectedStones(state.selectedStones)
  var height = getHeightOfSelectedStones(state.selectedStones)
  var topLeftStone = getTopLeftStoneOfSelectedStones(state.selectedStones)

  var colorOpp = Player.WHITE
  if (topLeftStone.player == Player.WHITE) {
      colorOpp = Player.BLACK
  }
  return {
    width: width + 1, 
    height: height + 1, 
    topLeftStone: topLeftStone, 
    colorOpp: colorOpp
  }
}

/*tc*/export/*etc*/function selectedStonesBuildABlock(selectedStonesInfo) {
  return selectedStonesInfo.width == selectedStonesInfo.height
}

/*tc*/export/*etc*/function selectedStonesBuildAHorizonalBlock(selectedStonesInfo) {
  return selectedStonesInfo.width > selectedStonesInfo.height
}

/*tc*/export/*etc*/function selectedStonesBuildAVerticalBlock(selectedStonesInfo) {
  return selectedStonesInfo.width < selectedStonesInfo.height
}

/*tc*/export/*etc*/function selectedStonesCanBeMovedDiagonally(state) {
  var stones = state.selectedStones
  return stones.length == 1 && isCornerStone(stones[0])
}

/*tc*/export/*etc*/function getPossibleTurnsForABlock(state, selectedStonesInfo) {
  var possibleTurns = []
  var possibleTurnsHorizontal = getPossibleTurnsHorizontal(state, selectedStonesInfo)
  var possibleTurnsVertical = getPossibleTurnsVertical(state, selectedStonesInfo)

  possibleTurns = getJoinedPossibleTurns(possibleTurnsHorizontal, possibleTurnsVertical);

  if (selectedStonesCanBeMovedDiagonally(state)) {
    var possibleTurnsDiagonal = getPossibleTurnsDiagonal(state)
    possibleTurns = getJoinedPossibleTurns(possibleTurns, possibleTurnsDiagonal)        
  }
  return possibleTurns
}

/*tc*/export/*etc*/function getPossibleTurnsForSelectedStones(state) {
  if(stonesBuildAMovableFigure(state)) {
    var selectedStonesInfo = getSelectedStonesInfo(state)

    if(selectedStonesBuildABlock(selectedStonesInfo)) {
      return getPossibleTurnsForABlock(state, selectedStonesInfo)
    } else if (selectedStonesBuildAHorizonalBlock(selectedStonesInfo)) {
      return getPossibleTurnsHorizontal(state, selectedStonesInfo)
    } else if (selectedStonesBuildAVerticalBlock(selectedStonesInfo)) {
      return getPossibleTurnsVertical(state, selectedStonesInfo)
    }
  }
  return createEmptyBoardMatrix()
}

/*tc*/export/*etc*/function getDirectionWhereStoneIsMoved (stones, destination) {
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

/*tc*/export/*etc*/function deleteStonesOnTheField (state, stones) {
  var field = state.field.slice()
  stones.map((stone) => {
    field[stone.position.col][stone.position.row] = 0
  })
  return field
}

/*tc*/export/*etc*/function createMovesForStonesToBeMoved (stones) {
  var moves = []
  stones.map((stone) => {
    moves.push(
      {
        stone: stone, 
        destination: {
          col: 0, 
          row: 0
        }
      }
    )
  })
  return moves
}

/*tc*/export/*etc*/function placeStonesNewInRightDirection (state, selectedStonesInfo, destination) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row
  var newState = Object.assign({}, state)

  for (var i = 0; i <= destination.col - topLeftX; i++) {
    for (var j = 0; j < height + 1; j++) {
      var x = topLeftStone.position.col + width + i
      var y = topLeftStone.position.row + j
      var destinationX = destination.col + width + i
      var destinationY = destination.row + j
      if (fieldHasGivenColor(state, x, y, colorOpp)) {
        newState.field[destinationX][destinationY] = colorOpp
        newState.field[x][y] = 0
        var stone = getStoneFromPosition(newState, {col: x, row: y})
        stone.position.col = destinationX
        stone.position.row = destinationY
      }
    }
  }
  return newState
}

/*tc*/export/*etc*/function placeStonesNewInLeftDirection (state, selectedStonesInfo, destination) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var newState = Object.assign({}, state)

  var sI = Object.assign({}, selectedStonesInfo)
  sI.width++
  sI.height++
  var lengthOpp = getLengthOfOpponentLeft(state, sI)

  for (var i = 0; i < lengthOpp; i++) {
    for (var j = 0; j < height + 1; j++) {
      var x = topLeftStone.position.col - i - 1
      var y = topLeftStone.position.row + j
      var destinationX = destination.col - i - 1
      var destinationY = destination.row + j
      if (fieldHasGivenColor(state, x, y, colorOpp)) {
        newState.field[destinationX][destinationY] = colorOpp
        newState.field[x][y] = 0
        var stone = getStoneFromPosition(newState, {col: x, row: y})
        stone.position.col = destinationX
        stone.position.row = destinationY
      }
    }
  }
  return newState
}

/*tc*/export/*etc*/function placeStonesNewInBelowDirection (state, selectedStonesInfo, destination) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var topLeftX = topLeftStone.position.col
  var topLeftY = topLeftStone.position.row
  var newState = Object.assign({}, state)

  for (var i = 0; i <= destination.row - topLeftY; i++) {
    for (var j = 0; j < width + 1; j++) {
      var x = topLeftStone.position.col + j
      var y = topLeftStone.position.row + height + i
      var destinationX = destination.col + j
      var destinationY = destination.row + height + i
      if (fieldHasGivenColor(state, x, y, colorOpp)) {
        newState.field[destinationX][destinationY] = colorOpp
        newState.field[x][y] = 0
        var stone = getStoneFromPosition(newState, {col: x, row: y})
        stone.position.col = destinationX
        stone.position.row = destinationY
      }
    }
  }
  return newState
}

/*tc*/export/*etc*/function placeStonesNewInAboveDirection (state, selectedStonesInfo, destination) {
  var { width, height, topLeftStone, colorOpp } = selectedStonesInfo
  var newState = Object.assign({}, state)

  var sI = Object.assign({}, selectedStonesInfo)
  sI.width++
  sI.height++
  var lengthOpp = getLengthOfOpponentAbove(state, sI)

  for (var i = 0; i <= lengthOpp; i++) {
    for (var j = 0; j < width + 1; j++) {
      var x = topLeftStone.position.col + j
      var y = topLeftStone.position.row - i
      var destinationX = destination.col + j
      var destinationY = destination.row - i
      if (fieldHasGivenColor(state, x, y, colorOpp)) {
        newState.field[destinationX][destinationY] = colorOpp
        newState.field[x][y] = 0
        var stone = getStoneFromPosition(newState, {col: x, row: y})
        stone.position.col = destinationX
        stone.position.row = destinationY
      }
    }
  }
  return newState
}

/*tc*/export/*etc*/function placeOpponentsStones (state, selectedStonesInfo, destination) {
  var direction = getDirectionWhereStoneIsMoved(state.selectedStones, destination)
  switch (direction) {
  case 0:
    return placeStonesNewInRightDirection(state, selectedStonesInfo, destination)
  case 1:
    return placeStonesNewInLeftDirection(state, selectedStonesInfo, destination)
  case 2:
    return placeStonesNewInBelowDirection(state, selectedStonesInfo, destination)
  case 3:
    return placeStonesNewInAboveDirection(state, selectedStonesInfo, destination)
  }
  return state
}

/*tc*/export/*etc*/function placeOwnStones (state, selectedStonesInfo, destination) {
  var { topLeftStone } = selectedStonesInfo
  var newState = Object.assign({}, state)
  var distanceX = destination.col - topLeftStone.position.col
  var distanceY = destination.row - topLeftStone.position.row
  
  newState.selectedStones.map((stone) => {
    newState.field[stone.position.col][stone.position.row] = 0
    stone.position.col = stone.position.col + distanceX
    stone.position.row = stone.position.row + distanceY
    newState.field[stone.position.col][stone.position.row] = stone.player
  })
  return newState
}

/*tc*/export/*etc*/function setTurn(state, destination) {
  var selectedStonesInfo = getSelectedStonesInfo(state)
  selectedStonesInfo.width -- 
  selectedStonesInfo.height --
  var newState = placeOpponentsStones(state, selectedStonesInfo, destination)

  return placeOwnStones(newState, selectedStonesInfo, destination)
}

/*tc*/export/*etc*/function getStoneFromPosition(state, position) {
  return state.stones.find((stone) => {
    return stone.position.col == position.col && stone.position.row == position.row
  })
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
