import { combineReducers } from 'redux'
import { FIELD_SIZE } from '../constants/game'
var {width, height} = require('Dimensions').get('window');
var TILE_SIZE = Math.floor(width * .95 / FIELD_SIZE);

function initialState(){
  return {
    SIZE: FIELD_SIZE,
    TILE_SIZE: TILE_SIZE,
    SCREEN_WIDTH: width,
    SCREEN_HEIGHT: height
  }
}

export default initialState