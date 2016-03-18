import { combineReducers } from 'redux'
import { PLAY_LOCALLY, PLAY_VIA_INTERNET, PLAY_AGAINST_COMPUTER } from '../actions/playModes'
import * as PlayModes from '../constants/playModes'

/*tc*/export/*etc*/function getInitialState() {
  return PlayModes.NOT_SELECTED
}

/*tc*/export/*etc*/function playModes(state = getInitialState(), action) {
  switch (action.type) {
    case PLAY_LOCALLY:
      return PlayModes.LOCALLY
    case PLAY_VIA_INTERNET:
      return PlayModes.INTERNET
    case PLAY_AGAINST_COMPUTER:
      return PlayModes.COMPUTER
    default:
      return state
  }
}

export default playModes