import { combineReducers } from 'redux'

import game from './game'
import levelSelection from './levelSelection'
import screenResolution from './screenResolution'
import login from './login'
import connection from './connection'

const tackleApp = combineReducers({
	connection,
	game,
	login,
	levelSelection,
	screenResolution
})

export default tackleApp