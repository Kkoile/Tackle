'use strict';
import { connect } from 'react-redux'
import { setStone, makeTurn } from '../actions/game'
import Game from '../views/game'

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetStone: (player, position) => {
      dispatch(setStone(player, position))
    },
    onMakeTurn: (player, turn) => {
      dispatch(makeTurn(player, turn))
    }
  }
}

const GameContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)

export default GameContainer