'use strict';
import { connect } from 'react-redux'
import {selectLevel} from '../actions/game'
import LevelSelection from '../views/levelSelection'

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLevelSelect: (name)  => {
      dispatch(selectLevel(name))
    }
  }
}

const LevelSelectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LevelSelection)

export default LevelSelectionContainer