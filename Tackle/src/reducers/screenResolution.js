import { combineReducers } from 'redux'
var {width, height} = require('Dimensions').get('window');
var SIZE = 10;
var TILE_SIZE = Math.floor(width * .95 / SIZE);

function initialState(){
  return {
    SIZE: SIZE,
    TILE_SIZE: TILE_SIZE
  }
}

export default initialState