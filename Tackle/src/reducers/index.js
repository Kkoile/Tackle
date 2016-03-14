import { combineReducers } from 'redux'

import game from './game'
import levelSelection from './levelSelection'
import screenResolution from './screenResolution'

const tackleApp = combineReducers({
	game,
	levelSelection,
	screenResolution
})

export default tackleApp