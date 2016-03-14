import { combineReducers } from 'redux'

function initialState() {
  return {
    forms: [
      
      {
        count: 3,
        tiles:[[1],[1],[1]],
        name:'Turm3'
      },
      
      {
        count: 3,
        tiles:[[0,0,1], [0,1,0], [1,0,0]],
        name:'Treppe3'
      },
      {
        count: 4,
        tiles: [[1], [1], [1], [1]],
        name: 'Turm4'
      },
      {
        count: 4,
        tiles: [[0,0,0,1], [0,0,1,0], [0,1,0,0], [1,0,0,0]],
        name:'Treppe4'
      }
    ]
  }
}

export default initialState