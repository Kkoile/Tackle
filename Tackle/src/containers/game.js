'use strict';
import { connect } from 'react-redux'
import { fieldClicked, stoneClicked } from '../actions/game'
import Game from '../views/game'

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickField: (player, position) => {
      dispatch(fieldClicked(player, position))
    },
    onClickStone: (stoneID) => {
      dispatch(stoneClicked(stoneID))
    }
  }
}

const GameContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)

export default GameContainer