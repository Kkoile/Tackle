import { combineReducers } from 'redux'
import game from './game'
import screenResolution from './screenResolution'

const tackleApp = combineReducers({
	game,
	screenResolution
})

export default tackleApp