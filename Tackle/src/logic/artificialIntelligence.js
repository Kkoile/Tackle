import { GameStates, Player, FIELD_SIZE } from '../constants/game'
import * as gameLogic from './gameLogic'
import * as gameReducer from '../reducers/game'

var depthInput = 2
var importantTurn = false
var firstTime = true
export function setStone (state) {
    var stone
    if (state.gameState.state != GameStates.BLACK_PLAYER_SET_GOLDEN_STONE) {
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
                break
            case 1:
                //right side
                position.col = FIELD_SIZE - 1
                position.row = Math.round(Math.random() * (FIELD_SIZE - 1))
                break
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
        for (var i in nextMoves) {
            var move = nextMoves[i]
            //Zug machen und eine Ebene weiter runter gehen
            var newState = gameReducer.setTurn(JSON.parse(JSON.stringify(move.state)), JSON.parse(JSON.stringify(move)))
            if (state.gameState.activePlayer == state.opponentColor) {
                currentScore = minimax(parseInt(depth) - 1, JSON.parse(JSON.stringify(newState)), alpha, beta).score
                //Zug bewerten
                if (currentScore > alpha) {
                    alpha = currentScore
                    bestMove = Object.assign({}, move)
                    bestMove.score = alpha
                }
            } else {
                currentScore = minimax(parseInt(depth) - 1, JSON.parse(JSON.stringify(newState)), alpha, beta).score
                //Zug bewerten
                if (currentScore < beta) {
                    beta = currentScore
                    bestMove = Object.assign({}, move)
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
/*tc*/export/*etc*/function generateMoves (state, color) {
    var moves = []
    var fieldTemp = state.field.slice()

    for (var i in fieldTemp) {
        for (var j in fieldTemp[i]) {
            var possibleTurns = null
            if (fieldTemp[i][j] == color) {
                var newState = JSON.parse(JSON.stringify(state))
                //Für jeden einzelnen Stein die möglichen Züge berechnen
                var stones = [Object.assign({}, getStoneFromPosition(newState, {col:i, row:j}))]
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
                    newState = Object.assign({}, state)
                    var stones = [] //new Stone[horizontalLength];
                    for (var k = 0; k < horizontalLength; k++) {
                        stones[k] = Object.assign({}, getStoneFromPosition(newState, {col: parseInt(i) + k, row: j}))
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
                    newState = Object.assign({}, state)
                    var stones = []

                    for (var k = 0; k < verticalLength; k++) {
                        stones[k] = Object.assign({}, getStoneFromPosition(newState, {col: i, row: parseInt(j) + k}))
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
                    newState = Object.assign({}, state)
                    var stones = []
                    var counter = 0
                    for (var k = 0; k < horizontalLength; k++) {
                        for (var k2 = 0; k2 < vLength; k2++) {
                            stones[counter] = Object.assign({}, getStoneFromPosition(newState, {col:k, row:k2}))
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

/*tc*/export/*etc*/function addPossibleTurns (moves, state, selectedStones, possibleTurns) {
    possibleTurns.map((col, i) => {
        col.map((field, j) => {
            if(field > 0) {
                var newState = Object.assign({}, state)
                newState.selectedStones = selectedStones.slice()
                newState.possibleTurns = possibleTurns.slice()
                moves.push({
                    state: newState,
                    position: {
                        col: i,
                        row: j
                    }
                })
            }
        })
    })
    return moves
}