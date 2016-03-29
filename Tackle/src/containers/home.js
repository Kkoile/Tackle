'use strict'
import { connect } from 'react-redux'
import * as PlayModes from '../constants/playModes'
import { setPlayMode, resetGame } from '../actions/game'
import { onPlayViaInternet } from '../actions/connection'
import Home from '../views/home'

var { Actions } = require('react-native-redux-router')

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    playLocally: () => {
      dispatch(setPlayMode(PlayModes.LOCALLY))
      Actions.levelSelection()
    },
    playViaInternet: () => {
      dispatch(setPlayMode(PlayModes.INTERNET))
      dispatch(onPlayViaInternet())
      Actions.userList()
    },
    playAgainstComputer: () => {
      dispatch(setPlayMode(PlayModes.COMPUTER))
      Actions.levelSelection()
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