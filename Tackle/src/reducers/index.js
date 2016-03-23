import { combineReducers } from 'redux'

import navigator from './navigator'
import game from './game'
import levelSelection from './levelSelection'
import screenResolution from './screenResolution'
import login from './login'
import connection from './connection'

const tackleApp = combineReducers({
	navigator,
	connection,
	game,
	login,
	levelSelection,
	screenResolution
})

export default tackleApp