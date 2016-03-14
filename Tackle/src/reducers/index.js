import { combineReducers } from 'redux'

import game from './game'
import levelSelection from './levelSelection'

const tackleApp = combineReducers({
	game,
	levelSelection
})

export default tackleApp