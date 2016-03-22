'use strict';
import { connect } from 'react-redux'
import * as PlayModes from '../constants/playModes'
import { setPlayMode, resetGame } from '../actions/game'
import Home from '../views/home'

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    playLocally: () => {
      dispatch(setPlayMode(PlayModes.LOCALLY))
    },
    playViaInternet: () => {
      dispatch(setPlayMode(PlayModes.INTERNET))
    },
    playAgainstComputer: () => {
      dispatch(setPlayMode(PlayModes.COMPUTER))
    },
    resetGame: () => {
      dispatch(resetGame())
    }
  }
}

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

export default HomeContainer