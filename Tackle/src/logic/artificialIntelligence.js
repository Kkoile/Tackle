import { GameStates, Player, FIELD_SIZE } from '../constants/game'
import * as gameLogic from './gameLogic'
var depthInput = 2
var importantTurn = false
export function setStone (state) {
    var stone
    if (state.gameState.state != GameStates.BLACK_PLAYER_SET_GOLDEN_STONE) {
        var field = state.field.slice()
        do {
            var position = {
                col: 0,
                row: 0
            }
            var side = Math.round(Math.random() * 3)
            switch (side) {
            case 0:
                //left side
                position.col = 0
                position.row = Math.round(Math.random() * (FIELD_SIZE - 1))
                break;
            case 1:
                //right side
                position.col = FIELD_SIZE - 1
                position.row = Math.round(Math.random() * (FIELD_SIZE - 1))
                break;
            case 2:
                //top side
                position.col = Math.round(Math.random() * (FIELD_SIZE - 1))
                position.row = 0
                break
            case 3:
                //bottom side
                position.col = Math.round(Math.random() * (FIELD_SIZE - 1))
                position.row = FIELD_SIZE - 1
                break
            }
            stone = createStone(state, state.opponentColor, position)
        } while (!gameLogic.positionIsAllowed(state, stone))
    } else {
        var position = {
            col: Math.round(Math.random() * 3) + 3,
            row: Math.round(Math.random() * 3) + 3
        }
        stone = createStone(state, state.opponentColor, position)
    }
    return stone
}

export function getNextMove (state) {
    return minimax(depthInput, Object.assign({}, state), -2000, +2000)
}

function createStone(state, player, position) {
  var id = 'stone' + state.stones.length
  return {
    id: id,
    player: player,
    position: position
  }
}

function getStoneFromPosition(state, position) {
  return state.stones.find((stone) => {
    return stone.position.col == position.col && stone.position.row == position.row
  })
}

function minimax (depth, state, alpha, beta) {
    //Alle moeglichen Zuege berechnen
    var nextMoves = generateMoves(state, state.gameState.activePlayer)
    var currentScore = 0
    var bestMove = {
        selectedStones: [],
        score: alpha
    }

    if (depth == 0) {
        //Wir sind am Ende unseres Baums angekommen und bewerten dann die Endsituation
        var score = evaluate(state)
        bestMove.score = score
        if (score != 0) {
            importantTurn = true
        }
        return bestMove
    } else {
        for (i in nextMoves) {
            var move = nextMoves[i]
            //Zug machen und eine Ebene weiter runter gehen
            var newState = gameLogic.setTurn(move.state, move.destination)
            if (state.gameState.activePlayer == state.opponentColor) {
                currentScore = minimax(parseInt(depth) - 1, newState, alpha, beta).score
                //Zug bewerten
                if (currentScore > alpha) {
                    alpha = currentScore
                    bestMove = move
                    bestMove.score = alpha
                }
            } else {
                currentScore = minimax(parseInt(depth) - 1, newState, alpha, beta).score
                //Zug bewerten
                if (currentScore < beta) {
                    beta = currentScore
                    bestMove = move
                    bestMove.score = beta
                }
            }
            if (alpha >= beta) {
                break
            }
        }

        if (state.gameState.activePlayer == state.opponentColor) {
            bestMove.score = alpha
        } else {
            bestMove.score = beta
        }

        if (depth == depthInput && !importantTurn) {
            bestMove = nextMoves[Math.round(Math.random() * (nextMoves.length-1))]
        }

        return bestMove
    }

}
function evaluate (state) {
    //Wenn man selber gewinnt plus 100
    //Wenn der Gegner gewinnt minus 100
    var score = 0
    if (gameLogic.playerHasWon(state, state.opponentColor)) {
        score += 100
    }
    if (gameLogic.playerHasWon(state, state.ownColor)) {
        score -= 100
    }
    return score
}
function generateMoves (state, color) { 
    var moves = []
    fieldTemp = state.field.slice()
    var newState = Object.assign({}, state)

    for (i in fieldTemp) {
        for (j in fieldTemp[i]) {
            var possibleTurns = null
            if (fieldTemp[i][j] == color) {
                //Für jeden einzelnen Stein die möglichen Züge berechnen
                var stones = [getStoneFromPosition(newState, {col:i, row:j})]
                newState.selectedStones = stones
                possibleTurns = gameLogic.getPossibleTurnsForSelectedStones(newState)
                moves = addPossibleTurns(moves, newState, stones, possibleTurns)

                //Für horizontale Schlange
                var horizontalLength = 1
                for (var k = parseInt(i) + 1; k < fieldTemp.length; k++) {
                    if (k in fieldTemp && j in fieldTemp[k] && fieldTemp[k][j] == color) {
                        horizontalLength++
                    } else {
                        break
                    }
                }
                if (horizontalLength > 1) { //gibt es überhaupt eine Schlange?
                    var stones = [] //new Stone[horizontalLength];
                    for (var k = 0; k < horizontalLength; k++) {
                        stones[k] = getStoneFromPosition(newState, {col: parseInt(i) + k, row: j})
                    }
                    newState.selectedStones = stones
                    possibleTurns = gameLogic.getPossibleTurnsForSelectedStones(newState)
                    moves = addPossibleTurns(moves, newState, stones, possibleTurns)
                }

                //Für vertikale Schlange
                var verticalLength = 1
                for (var k = parseInt(j) + 1; k < fieldTemp[i].length; k++) {
                    if (fieldTemp[i][k] == color) {
                        verticalLength++
                    } else {
                        break
                    }
                }
                if (verticalLength > 1) { //gibt es überhaupt eine Schlange?
                    var stones = []

                    for (var k = 0; k < verticalLength; k++) {
                        stones[k] = getStoneFromPosition(newState, {col: i, row: parseInt(j) + k});
                    }
                    newState.selectedStones = stones
                    possibleTurns = gameLogic.getPossibleTurnsForSelectedStones(newState)
                    moves = addPossibleTurns(moves, newState, stones, possibleTurns)
                }

                //Fürr Blöcke
                var vLength = verticalLength
                for (var k = 0; k < horizontalLength; k++) {
                    var laenge = 1
                    for (var k2 = 0; k2 < verticalLength; k2++) {
                        if (fieldTemp[k][k2] == color) {
                            laenge++
                        } else {
                            break
                        }
                    }
                    if (laenge < vLength) {
                        vLength = laenge
                    }
                }

                if (vLength > 1 && horizontalLength > 1) { //ob es einen Block gibt
                    var stones = []
                    var counter = 0
                    for (var k = 0; k < horizontalLength; k++) {
                        for (var k2 = 0; k2 < vLength; k2++) {
                            stones[counter] = getStoneFromPosition(newState, {col:k, row:k2})
                            counter++
                        }
                    }
                    newState.selectedStones = stones
                    possibleTurns = gameLogic.getPossibleTurnsForSelectedStones(newState)
                    moves = addPossibleTurns(moves, newState, stones, possibleTurns)
                }
            }
        }
    }

    return moves
}

function addPossibleTurns (moves, state, selectedStones, possibleTurns) {
    //2 Arrays zusammenbringen
    for (var k = 0; k < possibleTurns.length; k++) {
        for (var k2 = 0; k2 < possibleTurns[k].length; k2++) {
            if (possibleTurns[k][k2] > 0) {
                var newState = Object.assign({}, state)
                newState.selectedStones = selectedStones.slice()
                moves.push({
                    state: newState,
                    destination: {
                        col: k,
                        row: k2
                    }
                })
            }
        }
    }
    return moves
}