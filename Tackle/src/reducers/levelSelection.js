import { combineReducers } from 'redux'
import { levels } from '../constants/levels'

function initialState() {
  return {
    forms: levels
  }
}

export default initialState